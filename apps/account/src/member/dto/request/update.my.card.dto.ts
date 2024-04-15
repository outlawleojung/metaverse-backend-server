import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MemberBusinessCardInfo } from '@libs/entity';

export class CreateCardInfo extends MemberBusinessCardInfo {}

export class UpdateCardInfo extends CreateCardInfo {
  @IsNumber()
  @IsNotEmpty()
  public num: number;
}

export class DeleteCardInfo {
  @ApiProperty({
    example: 2,
    description: '명함 템플릿 아이디',
    required: true,
  })
  templateId: number;

  @ApiProperty({
    example: 10,
    description: '명함 번호 (순서)',
  })
  num: number;
}

export class UpdateMyCardDto {
  @ApiProperty({
    type: UpdateCardInfo,
    isArray: true,
    description: '갱신 비즈니스 명함',
  })
  @IsOptional()
  public readonly updateCardInfos: UpdateCardInfo[] | null;

  @ApiProperty({
    type: CreateCardInfo,
    isArray: true,
    description: '추가 비즈니스 명함',
  })
  @IsOptional()
  public readonly createCardInfos: CreateCardInfo[] | null;

  @ApiProperty({
    type: DeleteCardInfo,
    isArray: true,
    description: '삭제 비즈니스 명함',
  })
  @IsOptional()
  public readonly deleteCardInfos: DeleteCardInfo[] | null;
}
