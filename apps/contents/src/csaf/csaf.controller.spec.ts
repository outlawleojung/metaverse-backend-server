import { Test, TestingModule } from '@nestjs/testing';
import { CsafController } from './csaf.controller';

describe('CsafController', () => {
  let controller: CsafController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsafController],
    }).compile();

    controller = module.get<CsafController>(CsafController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
