import { Test, TestingModule } from '@nestjs/testing';
import { ManagerController } from './unification.controller';

describe('ManagerController', () => {
  let controller: ManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerController],
    }).compile();

    controller = module.get<ManagerController>(ManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
