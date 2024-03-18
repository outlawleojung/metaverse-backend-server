import { Test, TestingModule } from '@nestjs/testing';
import { PassController } from './app.controller';
import { PassService } from './app.service';

describe('PassController', () => {
  let passController: PassController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PassController],
      providers: [PassService],
    }).compile();

    passController = app.get<PassController>(PassController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(passController.getHello()).toBe('Hello World!');
    });
  });
});
