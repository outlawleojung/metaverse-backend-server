import { ApiProperty } from '@nestjs/swagger';

export class GetItemsResponseDTO {
  @ApiProperty({
    description: '아이템 목록',
    example: [
      {
        itemId: 300120,
        itemType: 1,
        itemTypeName: '인테리어',
        categoryType: 3,
        categoryTypeName: '장식',
        name: '산타모자',
        thumbnail: '300120',
      },
      {
        itemId: 300120,
        itemType: 1,
        itemTypeName: '인테리어',
        categoryType: 3,
        categoryTypeName: '장식',
        name: '산타모자',
        thumbnail: '300120',
      },
    ],
  })
  public readonly items: string[];
}
