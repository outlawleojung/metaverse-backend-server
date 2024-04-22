import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginateMemberDto {
  // 이전 마지막 데이터의 ID
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number = 0;

  // 정렬
  @IsIn(['ASC'])
  @IsOptional()
  order__createdAt: string = 'ASC';

  // 몇 개의 데이터를 응답으로 받을 지
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
