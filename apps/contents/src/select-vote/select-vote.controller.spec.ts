import { Test, TestingModule } from '@nestjs/testing';
import { SelectVoteController } from './select-vote.controller';

describe('SelectVoteController', () => {
  let controller: SelectVoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SelectVoteController],
    }).compile();

    controller = module.get<SelectVoteController>(SelectVoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
