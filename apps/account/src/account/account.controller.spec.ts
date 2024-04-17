import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthService } from '@libs/common';

describe('AccountController', () => {
  let accountController: AccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService, AuthService],
    }).compile();

    accountController = app.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });
});
