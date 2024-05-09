import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import {
  AuthService,
  BasicTokenGuard,
  QueryRunner,
  RefreshTokenGuard,
} from '@libs/common';
import { EmailLimitRepository, TransactionInterceptor } from '@libs/entity';
import { DataSource, EntityManager, QueryRunner as QR } from 'typeorm'; // 실제로는 데코레이터이지만 모킹의 목적으로 가져옴
import { MorganInterceptor } from 'nest-morgan';
import { AuthEmailDto } from './dto/request/auth.email.dto';

// 모킹된 의존성들
jest.mock('./account.service', () => ({
  AccountService: jest.fn().mockImplementation(() => ({
    authEmail: jest.fn(),
    confirmEmail: jest.fn(),
    resetPassword: jest.fn(),
  })),
}));

jest.mock('@libs/common', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    registerWithEmail: jest.fn(),
    loginWithEmail: jest.fn(),
    rotateToken: jest.fn(),
    extractTokenFromHeader: jest.fn(),
    decodeBasicToken: jest.fn(),
  })),
  BasicTokenGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn(() => true),
  })),
  RefreshTokenGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn(() => true),
  })),
  QueryRunner: jest.fn().mockImplementation(() => (target, key, index) => {
    // 필요한 동작 구현
  }),
}));

jest.mock('nest-morgan', () => ({
  MorganInterceptor: jest.fn().mockImplementation(() => ({
    intercept: jest.fn((context, next) => next.handle()),
  })),
}));

// DataSource 모킹
const mockDataSource: Partial<DataSource> = {
  createQueryRunner: jest.fn().mockReturnValue({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  }),
};

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => jest.fn(),
  getRepositoryToken: () => jest.fn(),
  Repository: class {},
  TypeOrmModule: {
    forRoot: jest.fn(),
    forFeature: jest.fn(() => ({
      provide: 'REPOSITORY',
      useClass: class MockRepository {},
    })),
  },
}));

jest.mock('typeorm', () => ({
  PrimaryColumn: jest.fn(() => jest.fn()),
  PrimaryGeneratedColumn: jest.fn(() => jest.fn()),
  JoinTable: jest.fn(() => jest.fn()),
  Unique: jest.fn(() => jest.fn()),
  Check: jest.fn(() => jest.fn()),
  Column: jest.fn(() => jest.fn()),
  Entity: jest.fn(() => jest.fn()),
  ManyToOne: jest.fn(() => jest.fn()),
  JoinColumn: jest.fn(() => jest.fn()),
  OneToMany: jest.fn(() => jest.fn()),
  OneToOne: jest.fn(() => jest.fn()),
  ManyToMany: jest.fn(() => jest.fn()),
  Index: jest.fn(() => jest.fn()),
  CreateDateColumn: jest.fn(() => jest.fn()),
  UpdateDateColumn: jest.fn(() => jest.fn()),
  DeleteDateColumn: jest.fn(() => jest.fn()),
  DataSource: jest.fn(() => mockDataSource),
  getDataSource: jest.fn(() => mockDataSource),
  getRepository: jest.fn(() => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  })),
}));

const mockQueryRunner: any = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {} as EntityManager,
  dataSource: {} as DataSource,
  // 필수적이지만 테스트에서는 사용되지 않는 기타 속성들을 undefined로 설정
};
describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService; // 서비스를 테스트에서 사용할 수 있도록 추가
  let authService: AuthService; // 서비스를 테스트에서 사용할 수 있도록 추가

  beforeEach(async () => {
    try {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AccountController],
        providers: [
          {
            provide: AccountService,
            useValue: {
              authEmail: jest.fn().mockResolvedValue({ status: 'success' }), // 이 위치에서 authEmail 모킹
            },
          },
          {
            provide: AuthService,
            useValue: {
              extractTokenFromHeader: jest.fn().mockReturnValue('mockToken'), // 모킹된 반환값 'mockToken' 설정
              decodeBasicToken: jest.fn().mockReturnValue({
                email: 'test@example.com',
                password: 'test',
              }),
              loginWithEmail: jest.fn().mockResolvedValue({
                accessToken: 'access',
                refreshToken: 'refresh',
              }),
              autoLogin: jest.fn().mockResolvedValue({
                accessToken: 'newAccessToken',
                refreshToken: 'newRefreshToken',
              }),
            },
          },
          {
            provide: QueryRunner,
            useValue: mockQueryRunner, // 모킹된 QueryRunner 사용
          },
          {
            provide: EmailLimitRepository,
            useValue: {
              findByEmail: jest.fn().mockResolvedValue({
                count: 10,
                updatedAt: new Date().toISOString(),
              }),
              // 다른 필요한 메서드 모킹
            },
          },
          BasicTokenGuard,
          RefreshTokenGuard,
          TransactionInterceptor,
          {
            provide: 'APP_INTERCEPTOR',
            useValue: MorganInterceptor('combined'),
          }, // MorganInterceptor를 APP_INTERCEPTOR로 제공
          { provide: DataSource, useValue: mockDataSource },
        ],
      })
        .overrideGuard(BasicTokenGuard)
        .useValue({ canActivate: jest.fn(() => true) }) // 가드를 오버라이드
        .overrideGuard(RefreshTokenGuard)
        .useValue({ canActivate: jest.fn(() => true) }) // 가드를 오버라이드
        .compile();

      accountController = module.get<AccountController>(AccountController);
      accountService = module.get<AccountService>(AccountService);
      authService = module.get<AuthService>(AuthService);
    } catch (error) {
      console.error('Failed to set up the test module:', error);
    }
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });

  it('should call loginWithEmail method with expected params', async () => {
    const mockRawToken = 'Basic dGVzdEBleGFtcGxlLmNvbTp0ZXN0';
    const expectedCredentials = { email: 'test@example.com', password: 'test' };

    const result = await accountController.loginEmail(mockRawToken);

    expect(authService.extractTokenFromHeader).toHaveBeenCalledWith(
      mockRawToken,
      false,
    );
    expect(authService.decodeBasicToken).toHaveBeenCalledWith('mockToken');
    expect(authService.loginWithEmail).toHaveBeenCalledWith(
      expectedCredentials,
    );
    expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
  });

  it('should call autoLogin method with expected params', async () => {
    const mockRawToken = 'Bearer tokenString';
    const result = await accountController.autoLogin(mockRawToken);

    expect(authService.extractTokenFromHeader).toHaveBeenCalledWith(
      mockRawToken,
      true,
    );
    expect(authService.autoLogin).toHaveBeenCalledWith('mockToken');
    expect(result).toEqual({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    });
  });

  it('should forward the autoEmailDto and queryRunner to the authEmail service method', async () => {
    const authEmailDto = { email: 'test@example.com' };

    // authEmail 메소드 호출
    const result = await accountController.authEmail(
      authEmailDto,
      mockQueryRunner,
    );

    // 기대 결과 검증
    expect(result).toBeDefined();
    // accountService.authEmail이 올바른 매개변수로 호출되었는지 확인
    expect(accountService.authEmail).toHaveBeenCalledWith(
      authEmailDto,
      mockQueryRunner,
    );
  });
});
