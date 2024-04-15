import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class DeleteMyRoomData {
  @ApiProperty({
    example: 1001,
    description: '아이템 아이디',
  })
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty({
    example: 1,
    description: '아이템 번호',
  })
  @IsNotEmpty()
  @IsNumber()
  num: number;
}

export class CreateMyRoomData extends DeleteMyRoomData {
  @ApiProperty({
    example: 3,
    description: '레이어 타입',
  })
  @IsNotEmpty()
  @IsNumber()
  layerType: number;

  @ApiProperty({
    example: 123,
    description: 'x 좌표',
  })
  @IsNotEmpty()
  @IsNumber()
  x: number;

  @ApiProperty({
    example: 45,
    description: 'y 좌표',
  })
  @IsNotEmpty()
  @IsNumber()
  y: number;

  @ApiProperty({
    example: 169,
    description: '회전값',
  })
  @IsNotEmpty()
  @IsNumber()
  rotation: number;
}

export class UpdateMyRoomData extends DeleteMyRoomData {
  @ApiProperty({
    example: 3,
    description: '레이어 타입',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  layerType: number | null;

  @ApiProperty({
    example: 123,
    description: 'x 좌표',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  x: number | null;

  @ApiProperty({
    example: 45,
    description: 'y 좌표',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  y: number | null;

  @ApiProperty({
    example: 169,
    description: '회전값',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  rotation: number | null;
}

export class CreateMyRoomDto {
  @ApiProperty({
    type: CreateMyRoomData,
    isArray: true,
    description: '마이룸 신규 생성 정보',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMyRoomData)
  public createMyRoomDatas: CreateMyRoomData[];

  @ApiProperty({
    type: UpdateMyRoomData,
    isArray: true,
    description: '마이룸 업데이트 정보',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMyRoomData)
  public updateMyRoomDatas: UpdateMyRoomData[];

  @ApiProperty({
    type: DeleteMyRoomData,
    isArray: true,
    description: '마이룸 삭제 정보',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeleteMyRoomData)
  public deleteMyRoomDatas: DeleteMyRoomData[];
}
