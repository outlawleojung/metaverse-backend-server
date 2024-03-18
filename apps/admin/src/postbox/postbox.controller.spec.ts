import { Test, TestingModule } from '@nestjs/testing';
import { PostboxController } from './postbox.controller';

describe('PostboxController', () => {
  let controller: PostboxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostboxController],
    }).compile();

    controller = module.get<PostboxController>(PostboxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
