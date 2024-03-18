import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservDto {
  @ApiProperty({
    example: 1,
    description: '모드 타입',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly modeType: number | null;

  @ApiProperty({
    example: '아즈메타 미팅',
    description: '오피스 룸 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly name: string | null;

  @ApiProperty({
    example: 1,
    description: '토픽 타입',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly topicType: number | null;

  @ApiProperty({
    example: 1,
    description: '알람 타입',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly alarmType: number | null;

  @ApiProperty({
    example: '아즈메타 회의실 입니다.',
    description: '오피스 설명',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly description: string | null;

  @ApiProperty({
    example: '123456',
    description: '패스워드',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly password: string | null;

  @ApiProperty({
    example: 1001,
    description: '룸 정보 아이디',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly spaceInfoId: number | null;

  @ApiProperty({
    example: 45,
    description: '진행 시간',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly runningTime: number | null;

  @ApiProperty({
    example: 10,
    description: '인원',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly personnel: number | null;

  @ApiProperty({
    example: 10,
    description: '관전 인원',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly observer: number | null;

  @ApiProperty({
    example: '2023-02-28',
    description: '예약설정 날짜',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly reservationAt: number | null;

  @ApiProperty({
    example: 380,
    description: '오피스 시작 시간 (분으로 환산)',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly startTime: number | null;

  @ApiProperty({
    example: 32,
    description: '반복 요일',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly repeatDay: number | null;

  @ApiProperty({
    example: 1,
    description: '홍보 노출 여부',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly isAdvertising: number | null;

  @ApiProperty({
    example: 1,
    description: '대기실 여부',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly isWaitingRoom: number | null;

  @ApiProperty({
    example: 1,
    description: '썸네일 삭제 여부',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly isDelete: number;
}
