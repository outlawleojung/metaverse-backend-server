import {
  AppendType,
  AreaType,
  AvatarPartsColorType,
  AvatarPartsGroupType,
  AvatarPartsSizeType,
  AvatarPartsStateType,
  AvatarPartsType,
  AvatarPreset,
  AvatarPresetType,
  AvatarResetInfo,
  BooleanType,
  BusinessCardTemplate,
  CategoryType,
  CommerceZoneMannequin,
  CommerceZoneItem,
  Faq,
  Forbiddenwords,
  FunctionTable,
  GradeType,
  InteriorInstallInfo,
  Item,
  ItemUseEffect,
  ItemType,
  LayerType,
  Localization,
  MannequinModelType,
  MannequinPurchaseState,
  OfficeAlarmType,
  OfficeAuthority,
  OfficeBookmark,
  OfficeDefaultOption,
  OfficeExposure,
  OfficeExposureType,
  OfficeGradeAuthority,
  OfficeGradeType,
  OfficeMode,
  OfficeModeSlot,
  OfficeModeType,
  OfficePermissionType,
  OfficeProductItem,
  OfficeSpaceInfo,
  OfficeShowRoomInfo,
  OfficeSpawnType,
  OfficeTopicType,
  OnfContentsType,
  OsType,
  PackageType,
  UploadType,
  ProviderType,
  PostalEffectType,
  PostalItemProperty,
  PostalMoneyProperty,
  PostalType,
  QuizAnswerType,
  QuizLevel,
  QuizQuestionAnswer,
  QuizRoundTime,
  QuizTimeType,
  ReportType,
  PaymentProductManager,
  ServerState,
  ServerType,
  VideoScreenInfo,
  VoteAlterResType,
  VoteDivType,
  VoteResType,
  VoteResultType,
  VoteStateType,
  WorldType,
  Member,
  MemberAvatarPartsItemInven,
  StartInventory,
  LandType,
  MapInfoType,
  MapExposulInfo,
  MyRoomStateType,
  MemberMyRoomInfo,
  NpcType,
  NpcLookType,
  SceneType,
  NpcList,
  NpcCostume,
  NpcArrange,
  MapExposulBrand,
  StartMyRoom,
  MoneyType,
  OfficeSeatInfo,
  DynamicLinkType,
  MemberFurnitureItemInven,
  BannerInfo,
  SpaceType,
  SpaceDetailType,
  ScreenContentType,
  ScreenInfo,
  SpaceInfo,
  VoteResultExposureType,
  EventSpaceType,
  ObjectInteractionType,
  SelectVoteStateType,
  MediaRollingType,
  BannerType,
  KtmfNftToken,
  KtmfSpecialItem,
  FileBoxType,
  ItemMaterial,
  BoothBannerInfo,
  BoothScreenInfo,
  MediaExposureType,
  NoticeType,
  NoticeExposureType,
} from '@libs/entity';
import { Inject, Injectable, HttpStatus, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CommonService, Decrypt, Encrypt } from '@libs/common';
import { ITEM_TYPE } from '@libs/constants';

@Injectable()
export class AppService {
  constructor(
    private commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  getHello(): string {
    return `${process.env.BRANCH_NAME} ARZMETA ACCOUNT SERVER !`;
  }

  async decrypt(token: string) {
    return Decrypt(token);
  }

  async encrypt(token: string) {
    return Encrypt(token);
  }

  async encryptAuth(_jwtAccessToken: string, _sessionId: string) {
    const jwtAccessToken = Encrypt(_jwtAccessToken);
    const sessionId = Encrypt(_sessionId);
    return { jwtAccessToken, sessionId };
  }

  async getDatabase() {
    const appendType = await this.dataSource.getRepository(AppendType).find();
    const areaType = await this.dataSource.getRepository(AreaType).find();
    const avatarPartsColorType = await this.dataSource.getRepository(AvatarPartsColorType).find();
    const avatarPartsGroupType = await this.dataSource.getRepository(AvatarPartsGroupType).find();
    const avatarPartsSizeType = await this.dataSource.getRepository(AvatarPartsSizeType).find();
    const avatarPartsStateType = await this.dataSource.getRepository(AvatarPartsStateType).find();
    const avatarPartsType = await this.dataSource.getRepository(AvatarPartsType).find();
    const avatarPreset = await this.dataSource.getRepository(AvatarPreset).find();
    const avatarPresetType = await this.dataSource.getRepository(AvatarPresetType).find();
    const avatarResetInfo = await this.dataSource.getRepository(AvatarResetInfo).find();
    const bannerInfo = await this.dataSource.getRepository(BannerInfo).find();
    const bannerType = await this.dataSource.getRepository(BannerType).find();
    const booleanType = await this.dataSource.getRepository(BooleanType).find();
    const boothBannerInfo = await this.dataSource.getRepository(BoothBannerInfo).find();
    const boothScreenInfo = await this.dataSource.getRepository(BoothScreenInfo).find();
    const businessCardTemplate = await this.dataSource.getRepository(BusinessCardTemplate).find();
    const categoryType = await this.dataSource.getRepository(CategoryType).find();
    const commerceZoneItem = await this.dataSource.getRepository(CommerceZoneItem).find();
    const commerceZoneMannequin = await this.dataSource.getRepository(CommerceZoneMannequin).find();
    const dynamicLinkType = await this.dataSource.getRepository(DynamicLinkType).find();
    const eventSpaceType = await this.dataSource.getRepository(EventSpaceType).find();
    const faq = await this.dataSource.getRepository(Faq).find();
    const fileBoxType = await this.dataSource.getRepository(FileBoxType).find();
    const forbiddenWords = await this.dataSource.getRepository(Forbiddenwords).find();
    const functionTable = await this.dataSource.getRepository(FunctionTable).find();
    const gradeType = await this.dataSource.getRepository(GradeType).find();
    const interiorInstallInfo = await this.dataSource.getRepository(InteriorInstallInfo).find();
    const item = await this.dataSource.getRepository(Item).find();
    const itemMaterial = await this.dataSource.getRepository(ItemMaterial).find();
    const itemUseEffect = await this.dataSource.getRepository(ItemUseEffect).find();
    const itemType = await this.dataSource.getRepository(ItemType).find();
    const ktmfNftToken = await this.dataSource.getRepository(KtmfNftToken).find();
    const ktmfSpecialItem = await this.dataSource.getRepository(KtmfSpecialItem).find();
    const landType = await this.dataSource.getRepository(LandType).find();
    const layerType = await this.dataSource.getRepository(LayerType).find();
    const localization = await this.dataSource.getRepository(Localization).find();
    const mapExposulBrand = await this.dataSource.getRepository(MapExposulBrand).find();
    const mapExposulInfo = await this.dataSource.getRepository(MapExposulInfo).find();
    const mapInfoType = await this.dataSource.getRepository(MapInfoType).find();
    const mannequinModelType = await this.dataSource.getRepository(MannequinModelType).find();
    const mannequinPurchaseState = await this.dataSource.getRepository(MannequinPurchaseState).find();
    const mediaExposureType = await this.dataSource.getRepository(MediaExposureType).find();
    const mediaRollingType = await this.dataSource.getRepository(MediaRollingType).find();
    const moneyType = await this.dataSource.getRepository(MoneyType).find();
    const myRoomStateType = await this.dataSource.getRepository(MyRoomStateType).find();
    const noticeExposureType = await this.dataSource.getRepository(NoticeExposureType).find();
    const noticeType = await this.dataSource.getRepository(NoticeType).find();
    const npcArrange = await this.dataSource.getRepository(NpcArrange).find();
    const npcCostume = await this.dataSource.getRepository(NpcCostume).find();
    const npcList = await this.dataSource.getRepository(NpcList).find();
    const npcLookType = await this.dataSource.getRepository(NpcLookType).find();
    const npcType = await this.dataSource.getRepository(NpcType).find();
    const objectInteractionType = await this.dataSource.getRepository(ObjectInteractionType).find();
    const officeAlarmType = await this.dataSource.getRepository(OfficeAlarmType).find();
    const officeAuthority = await this.dataSource.getRepository(OfficeAuthority).find();
    const officeBookmark = await this.dataSource.getRepository(OfficeBookmark).find();
    const officeDefaultOption = await this.dataSource.getRepository(OfficeDefaultOption).find();
    const officeExposure = await this.dataSource.getRepository(OfficeExposure).find();
    const officeExposureType = await this.dataSource.getRepository(OfficeExposureType).find();
    const officeGradeAuthority = await this.dataSource.getRepository(OfficeGradeAuthority).find();
    const officeGradeType = await this.dataSource.getRepository(OfficeGradeType).find();
    const officeMode = await this.dataSource.getRepository(OfficeMode).find();
    const officeModeSlot = await this.dataSource.getRepository(OfficeModeSlot).find();
    const officeModeType = await this.dataSource.getRepository(OfficeModeType).find();
    const officePermissionType = await this.dataSource.getRepository(OfficePermissionType).find();
    const officeProductItem = await this.dataSource.getRepository(OfficeProductItem).find();
    const officeSeatInfo = await this.dataSource.getRepository(OfficeSeatInfo).find();
    const officeShowRoomInfo = await this.dataSource.getRepository(OfficeShowRoomInfo).find();
    const officeSpaceInfo = await this.dataSource.getRepository(OfficeSpaceInfo).find();
    const officeSpawnType = await this.dataSource.getRepository(OfficeSpawnType).find();
    const officeTopicType = await this.dataSource.getRepository(OfficeTopicType).find();
    const onfContentsType = await this.dataSource.getRepository(OnfContentsType).find();
    const osType = await this.dataSource.getRepository(OsType).find();
    const packageType = await this.dataSource.getRepository(PackageType).find();
    const paymentProductManager = await this.dataSource.getRepository(PaymentProductManager).find();
    const postalEffectType = await this.dataSource.getRepository(PostalEffectType).find();
    const postalItemProperty = await this.dataSource.getRepository(PostalItemProperty).find();
    const postalMoneyProperty = await this.dataSource.getRepository(PostalMoneyProperty).find();
    const postalType = await this.dataSource.getRepository(PostalType).find();
    const providerType = await this.dataSource.getRepository(ProviderType).find();
    const quizAnswerType = await this.dataSource.getRepository(QuizAnswerType).find();
    const quizLevel = await this.dataSource.getRepository(QuizLevel).find();
    const quizQuestionAnswer = await this.dataSource.getRepository(QuizQuestionAnswer).find();
    const quizRoundTime = await this.dataSource.getRepository(QuizRoundTime).find();
    const quizTimeType = await this.dataSource.getRepository(QuizTimeType).find();
    const reportType = await this.dataSource.getRepository(ReportType).find();
    const sceneType = await this.dataSource.getRepository(SceneType).find();
    const screenContentType = await this.dataSource.getRepository(ScreenContentType).find();
    const screenInfo = await this.dataSource.getRepository(ScreenInfo).find();
    const selectVoteStateType = await this.dataSource.getRepository(SelectVoteStateType).find();
    const serverState = await this.dataSource.getRepository(ServerState).find();
    const serverType = await this.dataSource.getRepository(ServerType).find();
    const spaceDetailType = await this.dataSource.getRepository(SpaceDetailType).find();
    const spaceInfo = await this.dataSource.getRepository(SpaceInfo).find();
    const spaceType = await this.dataSource.getRepository(SpaceType).find();
    const uploadType = await this.dataSource.getRepository(UploadType).find();
    const videoScreenInfo = await this.dataSource.getRepository(VideoScreenInfo).find();
    const voteAlterResType = await this.dataSource.getRepository(VoteAlterResType).find();
    const voteDivType = await this.dataSource.getRepository(VoteDivType).find();
    const voteResType = await this.dataSource.getRepository(VoteResType).find();
    const voteResultExposureType = await this.dataSource.getRepository(VoteResultExposureType).find();
    const voteResultType = await this.dataSource.getRepository(VoteResultType).find();
    const voteStateType = await this.dataSource.getRepository(VoteStateType).find();
    const worldType = await this.dataSource.getRepository(WorldType).find();

    return {
      AppendType: appendType,
      AreaType: areaType,
      AvatarPartsColorType: avatarPartsColorType,
      AvatarPartsGroupType: avatarPartsGroupType,
      AvatarPartsSizeType: avatarPartsSizeType,
      AvatarPartsStateType: avatarPartsStateType,
      AvatarPartsType: avatarPartsType,
      AvatarPreset: avatarPreset,
      AvatarPresetType: avatarPresetType,
      AvatarResetInfo: avatarResetInfo,
      BannerInfo: bannerInfo,
      BannerType: bannerType,
      BooleanType: booleanType,
      BoothBannerInfo: boothBannerInfo,
      BoothScreenInfo: boothScreenInfo,
      BusinessCardTemplate: businessCardTemplate,
      CategoryType: categoryType,
      CommerceZoneItem: commerceZoneItem,
      CommerceZoneMannequin: commerceZoneMannequin,
      DynamicLinkType: dynamicLinkType,
      EventSpaceType: eventSpaceType,
      Faq: faq,
      FileBoxType: fileBoxType,
      ForbiddenWords: forbiddenWords,
      FunctionTable: functionTable,
      GradeType: gradeType,
      InteriorInstallInfo: interiorInstallInfo,
      Item: item,
      ItemMaterial: itemMaterial,
      ItemUseEffect: itemUseEffect,
      ItemType: itemType,
      KtmfNftToken: ktmfNftToken,
      KtmfSpecialItem: ktmfSpecialItem,
      LandType: landType,
      LayerType: layerType,
      Localization: localization,
      MapExposulBrand: mapExposulBrand,
      MapExposulInfo: mapExposulInfo,
      MapInfoType: mapInfoType,
      MannequinModelType: mannequinModelType,
      MannequinPurchaseState: mannequinPurchaseState,
      MediaExposureType: mediaExposureType,
      MediaRollingType: mediaRollingType,
      MoneyType: moneyType,
      MyRoomStateType: myRoomStateType,
      NoticeExposureType: noticeExposureType,
      NoticeType: noticeType,
      NpcArrange: npcArrange,
      NpcCostume: npcCostume,
      NpcList: npcList,
      NpcLookType: npcLookType,
      NpcType: npcType,
      ObjectInteractionType: objectInteractionType,
      OfficeAlarmType: officeAlarmType,
      OfficeAuthority: officeAuthority,
      OfficeBookmark: officeBookmark,
      OfficeDefaultOption: officeDefaultOption,
      OfficeExposure: officeExposure,
      OfficeExposureType: officeExposureType,
      OfficeGradeAuthority: officeGradeAuthority,
      OfficeGradeType: officeGradeType,
      OfficeMode: officeMode,
      OfficeModeSlot: officeModeSlot,
      OfficeModeType: officeModeType,
      OfficePermissionType: officePermissionType,
      OfficeProductItem: officeProductItem,
      OfficeSeatInfo: officeSeatInfo,
      OfficeShowRoomInfo: officeShowRoomInfo,
      OfficeSpaceInfo: officeSpaceInfo,
      OfficeSpawnType: officeSpawnType,
      OfficeTopicType: officeTopicType,
      OnfContentsType: onfContentsType,
      OsType: osType,
      PackageType: packageType,
      PaymentProductManager: paymentProductManager,
      PostalEffectType: postalEffectType,
      PostalItemProperty: postalItemProperty,
      PostalMoneyProperty: postalMoneyProperty,
      PostalType: postalType,
      ProviderType: providerType,
      QuizAnswerType: quizAnswerType,
      QuizLevel: quizLevel,
      QuizQuestionAnswer: quizQuestionAnswer,
      QuizRoundTime: quizRoundTime,
      QuizTimeType: quizTimeType,
      ReportType: reportType,
      ScreenContentType: screenContentType,
      ScreenInfo: screenInfo,
      SceneType: sceneType,
      SelectVoteStateType: selectVoteStateType,
      ServerState: serverState,
      ServerType: serverType,
      SpaceDetailType: spaceDetailType,
      SpaceInfo: spaceInfo,
      SpaceType: spaceType,
      UploadType: uploadType,
      VideoScreenInfo: videoScreenInfo,
      VoteAlterResType: voteAlterResType,
      VoteDivType: voteDivType,
      VoteResType: voteResType,
      VoteResultExposureType: voteResultExposureType,
      VoteResultType: voteResultType,
      VoteStateType: voteStateType,
      WorldType: worldType,
    };
  }

  async addEmail() {
    const members = await this.dataSource.getRepository(Member).find();

    console.log(members.length);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const member of members) {
        // 기본 아바타 인벤토리 설정
        const memberAvatarPartsItemInven = await this.dataSource.getRepository(MemberAvatarPartsItemInven).find({
          where: {
            memberId: member.memberId,
          },
        });

        if (memberAvatarPartsItemInven.length === 0) {
          console.log('############################# 없음 ############################');
          const avatarPartsItems = await this.dataSource
            .getRepository(StartInventory)
            .createQueryBuilder('startInventory')
            .innerJoinAndSelect('startInventory.Item', 'item')
            .where('Item.itemType = :itemType', { itemType: ITEM_TYPE.COSTUME })
            .getMany();

          for (let index = 0; index < avatarPartsItems.length; index++) {
            const item = avatarPartsItems[index];

            const memberAvatarPartsItemInven = new MemberAvatarPartsItemInven();
            memberAvatarPartsItemInven.memberId = member.memberId;
            memberAvatarPartsItemInven.itemId = item.itemId;

            await queryRunner.manager.getRepository(MemberAvatarPartsItemInven).save(memberAvatarPartsItemInven);
          }
          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
      }
      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB 실패');
    } finally {
      await queryRunner.release();
    }
    // const cards = await this.dataSource.getRepository(MemberArzmetaCardInfo).find();
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   for (const card of cards) {
    //     const member = new Member();
    //     member.memberId = card.memberId;
    //     member.nickname = card.nickname;
    //     member.stateMessage = card.stateMessage;
    //     await queryRunner.manager.getRepository(Member).save(member);
    //   }
    //   await queryRunner.commitTransaction();
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // const members = await this.dataSource.getRepository(Member).find({
    //   where: {},
    // });
    // try {
    //   for (const member of members) {
    //     await this.commonService.CreateMemberAvatarPartsInventoryInit(member.memberId, queryRunner);
    //   }
    //   await queryRunner.commitTransaction();
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }
    // const timestamp = new Date().getTime();
    // const startDate = new Date(StartedUnixTimestamp(timestamp));
    // const day = startDate.setMinutes(560);
    // const currentTime = dayjs(day).format('HH:mm:ss');
    // const currentTime = dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
    // console.log(currentTime);
    // const hour = 560 / 60;
    // const minute = 560 % 60;
    // const startTime = `${hour}:${minute}:00`;
    // const _reservationAt = new Date(data.reservationAt + ' 00:00:00');
    // _reservationAt.setMinutes(data.startTime);
    // const currentTime = dayjs(560).format('HH:mm:ss');
    // console.log(currentTime);
    // return currentTime;
    // const members = await this.dataSource.getRepository(Member).find();
    // console.log(members.length);
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   for (let index = 0; index < members.length; index++) {
    //     const m = members[index];
    //     const arzMetaCardInfo = new MemberArzmetaCardInfo();
    //     arzMetaCardInfo.memberId = m.memberId;
    //     arzMetaCardInfo.cardInfoId = 1;
    //     // arzMetaCardInfo.nickname = m.nickname;
    //     // arzMetaCardInfo.stateMessage = m.stateMessage;
    //     await queryRunner.manager.getRepository(MemberArzmetaCardInfo).save(arzMetaCardInfo);
    //     const defaultCardInfo = new MemberDefaultCardInfo();
    //     defaultCardInfo.memberId = m.memberId;
    //     defaultCardInfo.cardInfoId = 1;
    //     defaultCardInfo.num = 1;
    //     await queryRunner.manager.getRepository(MemberDefaultCardInfo).save(defaultCardInfo);
    //   }
    //   await queryRunner.commitTransaction();
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }
  }

  async addItem() {
    const members = await this.dataSource.getRepository(Member).find();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const member of members) {
        const memberMyRoomInfos = await this.dataSource.getRepository(MemberMyRoomInfo).find({
          where: {
            memberId: member.memberId,
          },
        });

        if (memberMyRoomInfos.length === 0) {
          const defaultMyRoomItems = await this.dataSource.getRepository(StartMyRoom).find();

          for (const item of defaultMyRoomItems) {
            const memberInvens = await queryRunner.manager.getRepository(MemberFurnitureItemInven).find({
              where: {
                memberId: member.memberId,
              },
            });

            for (const inven of memberInvens) {
              if (inven.itemId === item.itemId) {
                const myRoom = await queryRunner.manager.getRepository(MemberMyRoomInfo).findOne({
                  where: {
                    memberId: member.memberId,
                    itemId: inven.itemId,
                    num: inven.num,
                  },
                });

                if (!myRoom) {
                  const myRoomInfo = new MemberMyRoomInfo();
                  myRoomInfo.memberId = member.memberId;
                  myRoomInfo.itemId = item.itemId;
                  myRoomInfo.num = inven.num;
                  myRoomInfo.layerType = item.layerType;
                  myRoomInfo.x = item.x;
                  myRoomInfo.y = item.y;
                  myRoomInfo.rotation = item.rotation;
                  await queryRunner.manager.getRepository(MemberMyRoomInfo).save(myRoomInfo);
                }
              }
            }
          }
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    //   const newMember: string[] = [];
    //   try {
    //     for (const member of members) {
    //       const memberInven = await this.dataSource.getRepository(MemberInteriorItemInven).findOne({
    //         where: {
    //           itemId: 230005,
    //           memberId: member.memberId,
    //         },
    //       });
    //       if (!memberInven) {
    //         const miii = new MemberInteriorItemInven();
    //         miii.memberId = member.memberId;
    //         miii.itemId = 230005;
    //         miii.count = 1;
    //         await queryRunner.manager.getRepository(MemberInteriorItemInven).save(miii);
    //       }
    //       const memberMyRoom = await this.dataSource.getRepository(MemberMyRoomInfo).findOne({
    //         where: {
    //           itemId: 230005,
    //           memberId: member.memberId,
    //         },
    //       });
    //       if (!memberMyRoom) {
    //         const myRoom = new MemberMyRoomInfo();
    //         myRoom.memberId = member.memberId;
    //         myRoom.itemId = 230005;
    //         myRoom.layerType = 3;
    //         myRoom.x = 7;
    //         myRoom.y = 11;
    //         myRoom.rotation = 180;
    //         await queryRunner.manager.getRepository(MemberMyRoomInfo).save(myRoom);
    //       }
    //     }
    //     await queryRunner.commitTransaction();
    //     console.log(newMember);
    //   } catch (error) {
    //     await queryRunner.rollbackTransaction();
    //     return false;
    //   } finally {
    //     await queryRunner.release();
    //   }
    // }
    // async syncMemberItem() {
    //   const queryRunner = this.dataSource.createQueryRunner();
    //   await queryRunner.connect();
    //   await queryRunner.startTransaction();
    //   // const memberId = 'd4919c80-dfe9-11ed-a514-c16d6a4963e0';
    //   const member: string[] = [];
    //   member.push('4568a7e0-cb8c-11ed-9893-d5465f6fb4bf');
    //   member.push('4fc11970-cc6d-11ed-9893-d5465f6fb4bf');
    //   member.push('538367f0-c954-11ed-9893-d5465f6fb4bf');
    //   member.push('6029a9e0-cbd1-11ed-9893-d5465f6fb4bf');
    //   member.push('79452780-c9cc-11ed-9893-d5465f6fb4bf');
    //   member.push('c026ef90-dfe7-11ed-a514-c16d6a4963e0');
    //   const startItenInvens = await this.dataSource.getRepository(StartInventory).find({
    //     relations: ['Item'],
    //   });
    //   const startMyRooms = await this.dataSource.getRepository(StartMyRoom).find();
    //   try {
    //     // await queryRunner.manager.delete(MemberInteriorItemInven, { memberId: memberId });
    //     // for (const item of startItenInvens) {
    //     //   if (item.Item.itemType === ITEM_TYPE.INTERIOR) {
    //     //     const newItems = new MemberInteriorItemInven();
    //     //     newItems.memberId = memberId;
    //     //     newItems.itemId = item.itemId;
    //     //     newItems.count = item.count;
    //     //     await queryRunner.manager.getRepository(MemberInteriorItemInven).save(newItems);
    //     //   }
    //     // }
    //     for (const memberId of member) {
    //       await queryRunner.manager.delete(MemberMyRoomInfo, { memberId: memberId });
    //       for (const myRoom of startMyRooms) {
    //         const newMyRoom = new MemberMyRoomInfo();
    //         newMyRoom.memberId = memberId;
    //         newMyRoom.itemId = myRoom.itemId;
    //         newMyRoom.layerType = myRoom.layerType;
    //         newMyRoom.x = myRoom.x;
    //         newMyRoom.y = myRoom.y;
    //         newMyRoom.rotation = myRoom.rotation;
    //         await queryRunner.manager.getRepository(MemberMyRoomInfo).save(newMyRoom);
    //       }
    //     }
    //     await queryRunner.commitTransaction();
    //   } catch (error) {
    //     await queryRunner.rollbackTransaction();
    //     console.log(error);
    //     return false;
    //   } finally {
    //     await queryRunner.release();
    //   }
  }
}
