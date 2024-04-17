// import { Test, TestingModule } from '@nestjs/testing';
// import { AccountService } from './account.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import {
//   AuthService,
//   CommonService,
//   MockType,
//   repositoryMockFactory,
// } from '@libs/common';
// import { DataSource, Repository } from 'typeorm';
// import {
//   EmailCheck,
//   EmailConfirm,
//   Member,
//   MemberAccount,
//   MemberAvatarInfo,
//   MemberFurnitureItemInven,
//   MemberLoginRewardLog,
//   MemberMyRoomInfo,
//   MemberNftRewardLog,
//   MemberPasswordAuth,
//   StartInventory,
//   StartMyRoom,
// } from '@libs/entity';
// import { MailService } from '../mail/mail.service';

// describe('AccountService', () => {
//   let service: AccountService;
//   let memberRepositoryMock: MockType<Repository<Member>>;
//   let memberAccountRepositoryMock: MockType<Repository<MemberAccount>>;
//   let memberAvatarInfoRepositoryMock: MockType<Repository<MemberAvatarInfo>>;
//   let emailCheckRepositoryMock: MockType<Repository<EmailCheck>>;
//   let emailConfirmRepositoryMock: MockType<Repository<EmailConfirm>>;
//   let memberFurnitureItemInvenRepositoryMock: MockType<
//     Repository<MemberFurnitureItemInven>
//   >;
//   let memberMyRoomInfoRepositoryMock: MockType<Repository<MemberMyRoomInfo>>;
//   let startInventoryRepositoryMock: MockType<Repository<StartInventory>>;
//   let startMyRoomRepositoryMock: MockType<Repository<StartMyRoom>>;
//   let memberPasswordAuthRepositoryMock: MockType<
//     Repository<MemberPasswordAuth>
//   >;
//   let memberLoginRewardLogRepositoryMock: MockType<
//     Repository<MemberLoginRewardLog>
//   >;
//   let memberNftRewardLogRepositoryMock: MockType<
//     Repository<MemberNftRewardLog>
//   >;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AccountService,
//         {
//           provide: getRepositoryToken(Member),
//           useFactory: repositoryMockFactory,
//         },
//         {
//           provide: getRepositoryToken(MemberAccount),
//           useFactory: repositoryMockFactory<MemberAccount>,
//         },
//         {
//           provide: getRepositoryToken(MemberAvatarInfo),
//           useFactory: repositoryMockFactory<MemberAvatarInfo>,
//         },
//         {
//           provide: getRepositoryToken(EmailCheck),
//           useFactory: repositoryMockFactory<EmailCheck>,
//         },
//         {
//           provide: getRepositoryToken(EmailConfirm),
//           useFactory: repositoryMockFactory<EmailConfirm>,
//         },
//         {
//           provide: getRepositoryToken(MemberFurnitureItemInven),
//           useFactory: repositoryMockFactory<MemberFurnitureItemInven>,
//         },
//         {
//           provide: getRepositoryToken(MemberMyRoomInfo),
//           useFactory: repositoryMockFactory<MemberMyRoomInfo>,
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
//           provide: getRepositoryToken(MemberPasswordAuth),
//           useFactory: repositoryMockFactory<MemberPasswordAuth>,
//         },
//         {
//           provide: getRepositoryToken(MemberLoginRewardLog),
//           useFactory: repositoryMockFactory<MemberLoginRewardLog>,
//         },
//         {
//           provide: getRepositoryToken(MemberNftRewardLog),
//           useFactory: repositoryMockFactory<MemberNftRewardLog>,
//         },
//         {
//           provide: MailService,
//           useValue: jest.fn(() => ({
//             /* 메서드 목킹 */
//           })),
//         },
//         {
//           provide: AuthService,
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

//     service = module.get<AccountService>(AccountService);
//     memberRepositoryMock = module.get(getRepositoryToken(Member));
//     memberAccountRepositoryMock = module.get(getRepositoryToken(MemberAccount));
//     memberAvatarInfoRepositoryMock = module.get(
//       getRepositoryToken(MemberAvatarInfo),
//     );
//     emailCheckRepositoryMock = module.get(getRepositoryToken(EmailCheck));
//     emailConfirmRepositoryMock = module.get(getRepositoryToken(EmailConfirm));
//     memberFurnitureItemInvenRepositoryMock = module.get(
//       getRepositoryToken(MemberFurnitureItemInven),
//     );
//     memberMyRoomInfoRepositoryMock = module.get(
//       getRepositoryToken(MemberMyRoomInfo),
//     );
//     startInventoryRepositoryMock = module.get(
//       getRepositoryToken(StartInventory),
//     );
//     startMyRoomRepositoryMock = module.get(getRepositoryToken(StartMyRoom));
//     memberPasswordAuthRepositoryMock = module.get(
//       getRepositoryToken(MemberPasswordAuth),
//     );
//     memberLoginRewardLogRepositoryMock = module.get(
//       getRepositoryToken(MemberLoginRewardLog),
//     );
//     memberNftRewardLogRepositoryMock = module.get(
//       getRepositoryToken(MemberNftRewardLog),
//     );
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//     expect(memberRepositoryMock).toBeDefined();
//     expect(memberAccountRepositoryMock).toBeDefined();
//     expect(memberAvatarInfoRepositoryMock).toBeDefined();
//     expect(emailCheckRepositoryMock).toBeDefined();
//     expect(emailConfirmRepositoryMock).toBeDefined();
//     expect(memberFurnitureItemInvenRepositoryMock).toBeDefined();
//     expect(memberMyRoomInfoRepositoryMock).toBeDefined();
//     expect(startInventoryRepositoryMock).toBeDefined();
//     expect(startMyRoomRepositoryMock).toBeDefined();
//     expect(memberPasswordAuthRepositoryMock).toBeDefined();
//     expect(memberLoginRewardLogRepositoryMock).toBeDefined();
//     expect(memberNftRewardLogRepositoryMock).toBeDefined();
//   });
// });
