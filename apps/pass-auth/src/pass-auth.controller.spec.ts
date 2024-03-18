import { Test, TestingModule } from '@nestjs/testing';
import { PassAuthController } from './pass-auth.controller';
import { PassAuthService } from './pass-auth.service';

describe('PassAuthController', () => {
  let passAuthController: PassAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PassAuthController],
      providers: [PassAuthService],
    }).compile();

    passAuthController = app.get<PassAuthController>(PassAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(passAuthController.getHello()).toBe('Hello World!');
    });
  });
});
