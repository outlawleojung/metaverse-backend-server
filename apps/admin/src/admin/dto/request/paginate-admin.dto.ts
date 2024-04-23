import { BasePaginationDto } from 'apps/admin/src/common/dto/base-pagination.dto';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginateAdminDto extends BasePaginationDto {}
