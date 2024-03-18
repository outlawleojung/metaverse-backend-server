import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservDto {
  @ApiProperty({
    example: 1,
    description: '모드 타입',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly modeType: string;

  @ApiProperty({
    example: '아즈메타 미팅',
    description: '오피스 룸 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty({
    example: 1,
    description: '토픽 타입',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly topicType: string;

  @ApiProperty({
    example: 1,
    description: '알람 타입',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly alarmType: string;

  @ApiProperty({
    example: '아즈메타 회의실 입니다.',
    description: '오피스 설명',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly description: string;

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
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly spaceInfoId: string;

  @ApiProperty({
    example: 45,
    description: '진행 시간',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly runningTime: string;

  @ApiProperty({
    example: 10,
    description: '인원',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly personnel: string;

  @ApiProperty({
    example: 10,
    description: '관전 인원',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly observer: string;

  @ApiProperty({
    example: '2023-02-28',
    description: '예약설정 날짜',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly reservationAt: string | null;

  @ApiProperty({
    example: 380,
    description: '오피스 시작 시간 (분으로 환산)',
  })
  @IsString()
  public readonly startTime: string;

  @ApiProperty({
    example: 32,
    description: '반복 요일',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly repeatDay: string | null;

  @ApiProperty({
    example: 1,
    description: '홍보 노출 여부',
  })
  @IsString()
  public readonly isAdvertising: string;

  @ApiProperty({
    example: 1,
    description: '대기실 여부',
  })
  @IsString()
  public readonly isWaitingRoom: string;
}
