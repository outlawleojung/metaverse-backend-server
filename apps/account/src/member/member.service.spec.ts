// import { Test, TestingModule } from '@nestjs/testing';
// import { DataSource, Repository } from 'typeorm';
// import { MemberService } from './member.service';
// import {
//   AvatarPartsType,
//   AvatarPreset,
//   EmailCheck,
//   EmailConfirm,
//   Member,
//   MemberAccount,
//   MemberAvatarInfo,
// } from '@libs/entity';
// import {
//   AuthService,
//   CommonService,
//   MockType,
//   repositoryMockFactory,
// } from '@libs/common';
// import { getRepositoryToken } from '@nestjs/typeorm';

// describe('MemberService', () => {
//   let service: MemberService;
//   let commonServiceMock: MockType<CommonService>;
//   let memberRepositoryMock: MockType<Repository<Member>>;
//   let memberAccountRepositoryMock: MockType<Repository<MemberAccount>>;
//   let avatarPartsTypeRepositoryMock: MockType<Repository<AvatarPartsType>>;
//   let memberAvatarInfoRepositoryMock: MockType<Repository<MemberAvatarInfo>>;
//   let emailCheckRepositoryMock: MockType<Repository<EmailCheck>>;
//   let emailConfirmRepositoryMock: MockType<Repository<EmailConfirm>>;
//   let avatarPresetRepositoryMock: MockType<Repository<AvatarPreset>>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         MemberService,
//         {
//           provide: getRepositoryToken(Member),
//           useFactory: repositoryMockFactory<Member>,
//         },
//         {
//           provide: getRepositoryToken(MemberAccount),
//           useFactory: repositoryMockFactory<MemberAccount>,
//         },
//         {
//           provide: getRepositoryToken(AvatarPartsType),
//           useFactory: repositoryMockFactory<AvatarPartsType>,
//         },
//         {
//           provide: getRepositoryToken(MemberAvatarInfo),
//           useFactory: repositoryMockFactory<MemberAvatarInfo>,
//         },
//         {
//           provide: getRepositoryToken(EmailConfirm),
//           useFactory: repositoryMockFactory<EmailConfirm>,
//         },
//         {
//           provide: getRepositoryToken(EmailCheck),
//           useFactory: repositoryMockFactory<EmailCheck>,
//         },
//         {
//           provide: getRepositoryToken(AvatarPreset),
//           useFactory: repositoryMockFactory<AvatarPreset>,
//         },
//         {
//           provide: AuthService,
//           useValue: jest.fn(() => ({
//             /* 메서드 목킹 */
//           })),
//         },
//         {
//           provide: CommonService,
//           useValue: {
//             getMemberInfo: jest
//               .fn()
//               .mockResolvedValue({ id: 1, name: 'John Doe' }),
//           },
//         },
//         {
//           provide: DataSource,
//           useValue: {}, // 필요한 경우 DataSource를 모킹
//         },
//       ],
//     }).compile();

//     service = module.get<MemberService>(MemberService);
//     memberRepositoryMock = module.get(getRepositoryToken(Member));
//     memberAccountRepositoryMock = module.get(getRepositoryToken(MemberAccount));
//     avatarPartsTypeRepositoryMock = module.get(
//       getRepositoryToken(AvatarPartsType),
//     );
//     memberAvatarInfoRepositoryMock = module.get(
//       getRepositoryToken(MemberAvatarInfo),
//     );
//     emailCheckRepositoryMock = module.get(getRepositoryToken(EmailCheck));
//     emailConfirmRepositoryMock = module.get(getRepositoryToken(EmailConfirm));
//     avatarPresetRepositoryMock = module.get(getRepositoryToken(AvatarPreset));
//     commonServiceMock = module.get(CommonService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//     expect(memberRepositoryMock).toBeDefined();
//     expect(memberAccountRepositoryMock).toBeDefined();
//     expect(avatarPartsTypeRepositoryMock).toBeDefined();
//     expect(memberAvatarInfoRepositoryMock).toBeDefined();
//     expect(emailCheckRepositoryMock).toBeDefined();
//     expect(emailConfirmRepositoryMock).toBeDefined();
//     expect(avatarPresetRepositoryMock).toBeDefined();
//   });

//   describe('getMemberInfo', () => {
//     it('should return member info if the member exists', async () => {
//       const memberId = '1';
//       const expectedMemberInfo = { id: 1, name: 'John Doe' };
//       commonServiceMock.getMemberInfo.mockResolvedValue(expectedMemberInfo);

//       const result = await service.getMemberInfo(memberId);
//       expect(result).toEqual(expectedMemberInfo);
//       expect(commonServiceMock.getMemberInfo).toHaveBeenCalledWith(memberId);
//     });

//     it('should throw a NotFoundException if no member is found', async () => {
//       const memberId = 'unknown';
//       commonServiceMock.getMemberInfo.mockRejectedValue(
//         new Error('Member not found'),
//       );

//       await expect(service.getMemberInfo(memberId)).rejects.toThrow(
//         'Member not found',
//       );
//     });
//   });
// });
