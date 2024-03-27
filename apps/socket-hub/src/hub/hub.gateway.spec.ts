import { Test, TestingModule } from '@nestjs/testing';
import { HubGateway } from './hub.gateway';
import { HubService } from './hub.service';

describe('HubGateway', () => {
  let gateway: HubGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubGateway, HubService],
    }).compile();

    gateway = module.get<HubGateway>(HubGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
