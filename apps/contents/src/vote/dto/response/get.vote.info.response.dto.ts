import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class VoteInfo {
  @ApiProperty({
    example: 246,
    description: '아이디',
    required: true,
  })
  public id: number;

  @ApiProperty({
    example: '투표를 해봅시다',
    description: '투표이름',
    required: false,
  })
  public name: string;

  @ApiProperty({
    example: '아이폰이 갤럭시보다 더 좋다',
    description: '투표 질문',
    required: false,
  })
  public question: string;

  @ApiProperty({
    example: '1652337370806_0.jpg',
    description: '이미지 파일명',
    required: false,
  })
  public imageName: string;

  @ApiProperty({
    example: 1,
    description: '투표 구분',
    required: false,
  })
  public divType: number;

  @ApiProperty({
    example: 1,
    description: '투표 응답 방식',
    required: false,
  })
  public resType: number;

  @ApiProperty({
    example: 1,
    description: '양일 투표 응답 방식',
    required: false,
  })
  public alterResType: number;

  @ApiProperty({
    example: 1,
    description: '결과 노출 방식',
    required: false,
  })
  public resultExposureType: number;

  @ApiProperty({
    example: 1,
    description: '중간 결과 노출 여부',
    required: false,
  })
  public isExposingResult: number;

  @ApiProperty({
    example: 1,
    description: '응답 수정 가능 여부',
    required: false,
  })
  public isEnabledEdit: number;

  @ApiProperty({
    example: '2022-09-27 13:48:25',
    description: '투표 시작 일시',
    required: false,
  })
  public startedAt: Date;

  @ApiProperty({
    example: '2022-09-27 13:48:25',
    description: '투표 종료 일시',
    required: false,
  })
  public endedAt: Date;

  @ApiProperty({
    example: '2022-09-27 13:48:25',
    description: '결과 노출 종료 일시',
    required: false,
  })
  public resultEndedAt: Date;

  @ApiProperty({
    example: 2,
    description: '투표 진행 상태',
    required: false,
  })
  public stateType: number;
}

// 투표 결과 노출 정보
export class VoteResultInfo {
  @ApiProperty({
    example: 1,
    description: '번호',
  })
  public num: number;

  @ApiProperty({
    example: 1,
    description: '갯수',
  })
  public count: number;
}

// 투표 선택 보기 정보
export class VoteInfoExample {
  @ApiProperty({
    example: 1,
    description: '번호',
  })
  public num: number;

  @ApiProperty({
    example: '찬성',
    description: '선택 보기 종류',
  })
  public contents: string;
}

export class GetVoteInfoResponseDto extends SuccessDto {
  @ApiProperty({
    example: 200,
    description: '에러 코드',
    required: true,
  })
  public error: number;

  @ApiProperty({
    example: 'NET_E_SUCESS',
    description: '에러 메세지',
    required: true,
  })
  public errorMessage: string;

  @ApiProperty({
    example: 1,
    description: '투표 여부',
  })
  public isVote: number;

  @ApiProperty({
    example: 1,
    description: '투표 가능 여부',
  })
  public isEnabledVoteInfo: number;

  @ApiProperty({
    example: 0,
    description: '종료까지 남은 시간 (초)',
  })
  public endedRemainDt: number;

  @ApiProperty({
    example: 1159788,
    description: '결과 노출 종료까지 남은 시간 (초)',
  })
  public resultRemainDt: number;

  @ApiProperty({
    type: VoteInfo,
    description: '투표 정보',
  })
  public voteInfo: VoteInfo;

  @ApiProperty({
    type: VoteResultInfo,
    isArray: true,
    description: '투표 결과 목록',
  })
  public resultInfo: VoteResultInfo[];

  @ApiProperty({
    type: VoteInfoExample,
    isArray: true,
    description: '투표 선택 보기 목록',
  })
  public VoteInfoExamples: VoteInfoExample[];
}
