import { Test, TestingModule } from '@nestjs/testing';
import { OfficeGateway } from './office.gateway';

describe('OfficeGateway', () => {
  let gateway: OfficeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfficeGateway],
    }).compile();

    gateway = module.get<OfficeGateway>(OfficeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
