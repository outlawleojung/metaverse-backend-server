import { Test, TestingModule } from '@nestjs/testing';
import { CsafLicenseService } from './csaf-license.service';

describe('CsafLicenseService', () => {
  let service: CsafLicenseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsafLicenseService],
    }).compile();

    service = module.get<CsafLicenseService>(CsafLicenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
