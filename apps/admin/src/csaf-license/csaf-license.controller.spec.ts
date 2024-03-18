import { Test, TestingModule } from '@nestjs/testing';
import { CsafLicenseController } from './csaf-license.controller';

describe('CsafLicenseController', () => {
  let controller: CsafLicenseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsafLicenseController],
    }).compile();

    controller = module.get<CsafLicenseController>(CsafLicenseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
