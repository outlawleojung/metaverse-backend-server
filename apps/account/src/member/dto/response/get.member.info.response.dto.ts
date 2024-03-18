import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class GetMemberInfoResponseDto extends SuccessDto {
  @ApiProperty({
    example: {
      '1': 101,
      '2': 201,
      '3': 301,
      '4': 401,
    },
    description: '아바타 파츠 정보',
  })
  public avatarInfos: string;

  @ApiProperty({
    example: [
      {
        templateId: 2,
        num: 3,
        name: '한효주',
        job: '개발자',
        phone: '010-1234-5678',
        email: 'gksgywn@email.com',
      },
    ],

    description: '비즈니스 명함 정보',
  })
  public businessCardInfos: string;

  @ApiProperty({
    example: {
      templateId: 1,
      num: 1,
    },
    description: '기본 설정 명함 정보',
  })
  public defaultCardInfo: string;

  @ApiProperty({
    example: [
      {
        providerType: 1,
        accountToken: 'test@email.com',
      },
      {
        providerType: 2,
        accountToken: 'UcJjbiHZnDau0yPsp1f2OzuKb9smDR0_E',
      },
      {
        providerType: 3,
        accountToken: '1167587173554',
      },
    ],
    description: '계정 연동 정보',
  })
  public socialLoginInfo: string;

  @ApiProperty({
    example: [
      {
        itemId: 110001,
        num: 1,
        layerType: 1,
        x: 12,
        y: 8,
        rotation: 180,
      },
      {
        itemId: 110001,
        num: 2,
        layerType: 1,
        x: 22,
        y: 34,
        rotation: 32,
      },
      {
        itemId: 110002,
        num: 3,
        layerType: 2,
        x: 2,
        y: 10,
        rotation: 46,
      },
    ],
    description: '마이룸 리스트',
  })
  public myRoomList: string;

  @ApiProperty({
    example: [
      {
        itemId: 110001,
        num: 1,
        uploadType: 1,
        imageName: 'image.png',
      },
      {
        itemId: 110001,
        num: 2,
        uploadType: 2,
        imageName: 'https://google.com/image.png',
      },
    ],
    description: '마이룸 액자 이미지 리스트',
  })
  public myRoomFrameImages: string;

  @ApiProperty({
    example: [
      {
        itemId: 110001,
        num: 1,
      },
      {
        itemId: 110002,
        num: 2,
      },
    ],
    description: '인테리어 인벤토리',
  })
  public interiorItemInvens: string;

  @ApiProperty({
    example: [
      {
        itemId: 210001,
      },
      {
        itemId: 210002,
      },
    ],
    description: '아바타 파츠 인벤토리',
  })
  public avatarPartsItemInvens: string;

  @ApiProperty({
    example: [
      {
        moneyType: 1,
        count: 10,
      },
      {
        moneyType: 3,
        count: 20,
      },
    ],
    description: '앱 정보 : 컨텐츠 온오프 정보, 스크린 정보, 배너 정보',
  })
  public moneyInfos: string;

  @ApiProperty({
    example: [
      {
        contentsId: 1001,
      },
      {
        contentsId: 1002,
      },
    ],
    description: '광고 컨텐츠 보상 완료',
  })
  public memberAdContents: string;

  @ApiProperty({
    example: '1bkdfk234923gjklegf909239023ojg023',
    description: '지갑 주소',
  })
  public walletAddr: string;
}
