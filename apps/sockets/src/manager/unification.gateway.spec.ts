import { Test, TestingModule } from '@nestjs/testing';
import { UnificationGateway } from './unification.gateway';

describe('ManagerGateway', () => {
  let gateway: UnificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnificationGateway],
    }).compile();

    gateway = module.get<UnificationGateway>(UnificationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
