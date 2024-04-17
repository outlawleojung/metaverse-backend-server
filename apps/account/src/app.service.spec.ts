// import { Test, TestingModule } from '@nestjs/testing';
// import { AppService } from './app.service';
// import {
//   Member,
//   MemberAccount,
//   MemberAvatarPartsItemInven,
//   MemberFurnitureItemInven,
//   MemberMyRoomInfo,
//   MemberWalletInfo,
//   StartInventory,
//   StartMyRoom,
// } from '@libs/entity';
// import { CommonService, MockType, repositoryMockFactory } from '@libs/common';
// import { DataSource, Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { TasksService } from './tasks/tasks.service';

// describe('AppService', () => {
//   let service: AppService;
//   let memberRepositoryMock: MockType<Repository<Member>>;
//   let memberAccountRepositoryMock: MockType<Repository<MemberAccount>>;
//   let memberFurnitureItemInvenRepositoryMock: MockType<
//     Repository<MemberFurnitureItemInven>
//   >;

//   let memberAvatarPartsItemInvenRepositoryMock: MockType<
//     Repository<MemberAvatarPartsItemInven>
//   >;
//   let memberMyRoomInfoRepositoryMock: MockType<Repository<MemberMyRoomInfo>>;
//   let memberWalletInfoRepositoryMock: MockType<Repository<MemberWalletInfo>>;

//   let startInventoryRepositoryMock: MockType<Repository<StartInventory>>;
//   let startMyRoomRepositoryMock: MockType<Repository<StartMyRoom>>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AppService,
//         {
//           provide: getRepositoryToken(Member),
//           useFactory: repositoryMockFactory,
//         },
//         {
//           provide: getRepositoryToken(MemberAccount),
//           useFactory: repositoryMockFactory<MemberAccount>,
//         },
//         {
//           provide: getRepositoryToken(MemberFurnitureItemInven),
//           useFactory: repositoryMockFactory<MemberFurnitureItemInven>,
//         },
//         {
//           provide: getRepositoryToken(MemberAvatarPartsItemInven),
//           useFactory: repositoryMockFactory<MemberAvatarPartsItemInven>,
//         },
//         {
//           provide: getRepositoryToken(MemberMyRoomInfo),
//           useFactory: repositoryMockFactory<MemberMyRoomInfo>,
//         },
//         {
//           provide: getRepositoryToken(MemberWalletInfo),
//           useFactory: repositoryMockFactory<MemberWalletInfo>,
//         },
//         {
//           provide: getRepositoryToken(StartInventory),
//           useFactory: repositoryMockFactory<StartInventory>,
//         },
//         {
//           provide: getRepositoryToken(StartMyRoom),
//           useFactory: repositoryMockFactory<StartMyRoom>,
//         },
//         {
//           provide: TasksService,
//           useValue: jest.fn(() => ({
//             /* 메서드 목킹 */
//           })),
//         },
//         {
//           provide: CommonService,
//           useValue: jest.fn(() => ({
//             /* 메서드 목킹 */
//           })),
//         },
//         {
//           provide: DataSource,
//           useValue: {}, // 필요한 경우 DataSource를 모킹
//         },
//       ],
//     }).compile();

//     service = module.get<AppService>(AppService);
//     memberRepositoryMock = module.get(getRepositoryToken(Member));
//     memberAccountRepositoryMock = module.get(getRepositoryToken(MemberAccount));
//     memberFurnitureItemInvenRepositoryMock = module.get(
//       getRepositoryToken(Member),
//     );
//     memberAvatarPartsItemInvenRepositoryMock = module.get(
//       getRepositoryToken(MemberAccount),
//     );
//     memberMyRoomInfoRepositoryMock = module.get(getRepositoryToken(Member));
//     memberWalletInfoRepositoryMock = module.get(
//       getRepositoryToken(MemberAccount),
//     );
//     startMyRoomRepositoryMock = module.get(getRepositoryToken(StartMyRoom));
//     startInventoryRepositoryMock = module.get(
//       getRepositoryToken(StartInventory),
//     );
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//     expect(memberRepositoryMock).toBeDefined();
//     expect(memberAccountRepositoryMock).toBeDefined();
//     expect(memberAvatarPartsItemInvenRepositoryMock).toBeDefined();
//     expect(memberFurnitureItemInvenRepositoryMock).toBeDefined();
//     expect(memberMyRoomInfoRepositoryMock).toBeDefined();
//     expect(memberWalletInfoRepositoryMock).toBeDefined();
//     expect(startInventoryRepositoryMock).toBeDefined();
//     expect(startMyRoomRepositoryMock).toBeDefined();
//   });
// });
