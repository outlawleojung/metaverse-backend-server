import { ApiProperty } from '@nestjs/swagger';

export class DefaultReservationInfo {
  @ApiProperty({
    example: '343262394',
    description: '룸 코드',
    required: true,
  })
  public roomCode: string;

  @ApiProperty({
    example: '아즈메타 회의실',
    description: '오피스 룸 이름',
    required: true,
  })
  public roomName: string;

  @ApiProperty({
    example: 1,
    description: '모드 타입',
    required: true,
  })
  public modeType: number;

  @ApiProperty({
    example: 1,
    description: '토픽 타입',
    required: true,
  })
  public topicType: number;

  @ApiProperty({
    example: '아즈메타 회의실 입니다.',
    description: '오피스 룸 설명',
    required: true,
  })
  public description: string;

  @ApiProperty({
    example: 0,
    description: '진행 시간',
    required: true,
  })
  public runningTime: number;

  @ApiProperty({
    example: 10001,
    description: '공간 선택 아이디',
    required: true,
  })
  public spaceInfoId: number;

  @ApiProperty({
    example: 4,
    description: '인원',
    required: true,
  })
  public personnel: number;

  @ApiProperty({
    example: 1,
    description: '알람 타입',
    required: true,
  })
  public alarmType: number;

  @ApiProperty({
    example: 1,
    description: '홍보 노출 여부',
    required: true,
  })
  public isAdvertising: number;

  @ApiProperty({
    example: 1,
    description: '대기실 여부',
    required: true,
  })
  public isWaitingRoom: number;

  @ApiProperty({
    example: 10,
    description: '관전자',
    required: false,
  })
  public observer: number;

  @ApiProperty({
    example: 'image.png',
    description: '썸네일',
    required: false,
  })
  public thumbnail: string;

  @ApiProperty({
    example: '2022-09-27',
    description: '예약 날짜',
    required: false,
  })
  public reservationAt: Date;

  @ApiProperty({
    example: 53,
    description: '반복 요일',
    required: false,
  })
  public repeatDay: number;

  @ApiProperty({
    example: 540,
    description: '시작 시간',
    required: true,
  })
  public startTime: number;

  @ApiProperty({
    example: '왕방구',
    description: '예약자 이름',
    required: true,
  })
  public nickname: string;

  @ApiProperty({
    example: '4KI5A046V',
    description: '예약자 회원코드',
    required: true,
  })
  public memberCode: string;
}
