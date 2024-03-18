import { Test, TestingModule } from '@nestjs/testing';
import { PostboxService } from './postbox.service';

describe('PostboxService', () => {
  let service: PostboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostboxService],
    }).compile();

    service = module.get<PostboxService>(PostboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
