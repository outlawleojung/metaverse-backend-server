import { entityProviders } from './entity.providers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AdContents } from '../entities/adContents.entity';
import { AdminLog } from '../entities/adminLog.entity';
import { AdminType } from '../entities/adminType.entity';
import { AppendType } from '../entities/appendType.entity';
import { AreaType } from '../entities/areaType.entity';
import { AvatarPartsColorType } from '../entities/avatarPartsColorType.entity';
import { AvatarPartsGroupType } from '../entities/avatarPartsGroupType.entity';
import { AvatarPartsSizeType } from '../entities/avatarPartsSizeType.entity';
import { AvatarPartsStateType } from '../entities/avatarPartsStateType.entity';
import { AvatarPartsType } from '../entities/avatarPartsType.entity';
import { AvatarPreset } from '../entities/avatarPreset.entity';
import { AvatarPresetType } from '../entities/avatarPresetType.entity';
import { AvatarResetInfo } from '../entities/avatarResetInfo.entity';
import { AzureStorage } from '../entities/azureStorage.entity';
import { BannerInfo } from '../entities/bannerInfo.entity';
import { BannerType } from '../entities/bannerType.entity';
import { BannerReservation } from '../entities/bannerReservation.entity';
import { BlockchainTransferEventLog } from '../entities/blockchainTransferEventLog.entity';
import { BooleanType } from '../entities/booleanType.entity';
import { BoothBannerInfo } from '../entities/boothBannerInfo.entity';
import { BoothFileBoxInfo } from '../entities/boothFileBoxInfo.entity';
import { BoothScreenInfo } from '../entities/boothScreenInfo.entity';
import { BusinessCardTemplate } from '../entities/businessCardTemplate.entity';
import { BuySellType } from '../entities/buySellType.entity';
import { CategoryType } from '../entities/categoryType.entity';
import { CommerceZoneMannequin } from '../entities/commerceZoneMannequin.entity';
import { CSAFEventEnterLog } from '../entities/csafEventEnterLog.entity';
import { CSAFEventInfo } from '../entities/csafEventInfo.entity';
import { CSAFEventBoothInfo } from '../entities/csafEventBoothInfo.entity';
import { DisciplineDetail } from '../entities/disciplineDetail.entity';
import { DisciplineReview } from '../entities/disciplineReview.entity';
import { DisciplineType } from '../entities/disciplineType.entity';
import { DepartmentType } from '../entities/departmentType.entity';
import { DynamicLinkType } from '../entities/dynamicLinkType.entity';
import { EachBoothBannerInfo } from '../entities/eachBoothBannerInfo.entity';
import { EachBoothScreenInfo } from '../entities/eachBoothScreenInfo.entity';
import { EmailCheck } from '../entities/emailCheck.entity';
import { EmailConfirm } from '../entities/emailConfirm.entity';
import { EmailLimit } from '../entities/emailLimit.entity';
import { EnabledType } from '../entities/enabledType.entity';
import { EventSpaceType } from '../entities/eventSpaceType.entity';
import { Faq } from '../entities/faq.entity';
import { FileBoxType } from '../entities/fileBoxType.entity';
import { Forbiddenwords } from '../entities/forbiddenwords.entity';
import { FunctionTable } from '../entities/functionTable.entity';
import { Gateway } from '../entities/gateway.entity';
import { GradeType } from '../entities/gradeType.entity';
import { InfiniteCodeRank } from '../entities/infiniteCodeRank.entity';
import { InteriorInstallInfo } from '../entities/interiorInstallInfo.entity';
import { InquiryTemplate } from '../entities/inquiryTemplate.entity';
import { InquiryAnswerType } from '../entities/inquiryAnswerType.entity';
import { InquiryType } from '../entities/inquiryType.entity';
import { Item } from '../entities/item.entity';
import { ItemMaterial } from '../entities/itemMaterial.entity';
import { ItemType } from '../entities/itemType.entity';
import { InteractionType } from '../entities/interactionType.entity';
import { JumpingMatchingGameType } from '../entities/jumpingMatchingGameType.entity';
import { JumpingMatchingLevel } from '../entities/jumpingMatchingLevel.entity';
import { KtmfEventEmailInfo } from '../entities/ktmfEventEmailInfo.entiry';
import { KtmfNftToken } from '../entities/ktmfNftToken.entiry';
import { KtmfNftTokenToWallet } from '../entities/ktmfTokenToWallet.entity';
import { KtmfNftTokenToWalletLog } from '../entities/ktmfTokenToWalletLog.entity';
import { KtmfSpecialItem } from '../entities/ktmfSpecialItem.entiry';
import { KtmfSpecialMoney } from '../entities/ktmfSpecialMoney.entity';
import { KtmfPassTierRatingType } from '../entities/ktmfPassTierRatingType.entity';
import { LayerType } from '../entities/layerType.entity';
import { LandType } from '../entities/landType.entity';
import { LicenseInfo } from '../entities/licenseInfo.entity';
import { LicenseType } from '../entities/licenseType.entity';
import { LicenseFunction } from '../entities/licenseFunction.entity';
import { LicenseTypeInfo } from '../entities/licenseTypeInfo.entity';
import { Localization } from '../entities/localization.entity';
import { LogActionType } from '../entities/logActionType.entity';
import { LogContentType } from '../entities/logContentType.entity';
import { MannequinModelType } from '../entities/mannequinModelType.entity';
import { MannequinPurchaseState } from '../entities/mannequinPurchaseState.entity';
import { MapExposulInfo } from '../entities/mapExposulInfo.entity';
import { MapExposulBrand } from '../entities/mapExposulBrand.entity';
import { MapInfoType } from '../entities/mapInfoType.entity';
import { MediaExposureType } from '../entities/mediaExposureType.entity';
import { MediaRollingType } from '../entities/mediaRollingType.entity';
import { Member } from '../entities/member.entity';
import { MemberAccount } from '../entities/memberAccount.entity';
import { MemberAdContents } from '../entities/memberAdContents.entity';
import { MemberAvatarInfo } from '../entities/memberAvatarInfo.entity';
import { MemberBlock } from '../entities/memberBlock.entity';
import { MemberBusinessCardInfo } from '../entities/memberBusinessCardInfo.entity';
import { MemberConnectInfo } from '../entities/memberConnectInfo.entity';
import { MemberDefaultCardInfo } from '../entities/memberDefaultCardInfo.entity';
import { MemberFrameImage } from '../entities/memberFrameImage.entity';
import { MemberFriend } from '../entities/memberFriend.entity';
import { MemberFriendRequest } from '../entities/memberFriendRequest.entity';
import { MemberFurnitureItemInven } from '../entities/memberFurnitureItemInven.entity';
import { MemberIdentification } from '../entities/memberIdentification.entity';
import { MemberInfiniteCodeRank } from '../entities/memberInfiniteCodeRank.entity';
import { MemberInquiry } from '../entities/memberInquiry.entity';
import { MemberInquiryAnswer } from '../entities/memberInquiryAnswer.entity';
import { MemberInquiryManager } from '../entities/memberInquiryManager.entity';
import { MemberInquiryGroup } from '../entities/memberInquiryGroup.entity';
import { MemberAvatarPartsItemInven } from '../entities/memberAvatarPartsItemInven.entity';
import { MemberItemInven } from '../entities/memberItemInven.entity';
import { MemberLoginLog } from '../entities/memberLoginLog.entity';
import { MemberLoginRewardLog } from '../entities/memberLoginRewardLog.entity';
import { MemberMoney } from '../entities/memberMoney.entity';
import { MemberMyRoomInfo } from '../entities/memberMyRoomInfo.entity';
import { MemberNftRewardLog } from '../entities/memberNftRewardLog.entity';
import { MemberOfficeReservationInfo } from '../entities/memberOfficeReservationInfo.entity';
import { MemberOfficeReservationWaitingInfo } from '../entities/memberOfficeReservationWaitingInfo.entity';
import { MemberOfficeVisitLog } from '../entities/memberOfficeVisitLog.entity';
import { MemberNicknameLog } from '../entities/memberNicknameLog.entity';
import { MemberLicenseInfo } from '../entities/memberLicenseInfo.entity';
import { MemberPasswordAuth } from '../entities/memberPasswordAuth.entity';
import { MemberPostbox } from '../entities/memberPostbox.entity';
import { MemberPurchaseItem } from '../entities/memberPurchaseItem.entity';
import { MemberReportInfo } from '../entities/memberReportInfo.entity';
import { MemberSelectVoteInfo } from '../entities/memberSelectVoteInfo.entity';
import { MemberSelectVoteLike } from '../entities/memberSelectVoteLike.entity';
import { MemberVoteInfo } from '../entities/memberVoteInfo.entity';
import { MemberWalletInfo } from '../entities/memberWalletInfo.entity';
import { MemberWalletLinkLog } from '../entities/memberWalletLinkLog.entity';
import { MoneyType } from '../entities/moneyType.entity';
import { MyRoomStateType } from '../entities/myRoomStateType.entity';
import { NoticeExposureType } from '../entities/noticeExposureType.entity';
import { NoticeInfo } from '../entities/noticeInfo.entity';
import { NoticeType } from '../entities/noticeType.entity';
import { NpcArrange } from '../entities/npcArrange.entity';
import { NpcCostume } from '../entities/npcCostume.entity';
import { NpcList } from '../entities/npcList.entity';
import { NpcLookType } from '../entities/npcLookType.entity';
import { NpcType } from '../entities/npcType.entity';
import { ObjectInteractionType } from '../entities/objectInteractionType.entity';
import { OfficeAuthority } from '../entities/officeAuthority.entity';
import { OfficeBookmark } from '../entities/officeBookmark.entity';
import { OfficeDefaultOption } from '../entities/officeDefaultOption.entity';
import { OfficeExposure } from '../entities/officeExposure.entity';
import { OfficeExposureType } from '../entities/officeExposureType.entity';
import { OfficeGradeType } from '../entities/officeGradeType.entity';
import { OfficeLicenseDomainInfo } from '../entities/officeLicenseDomainInfo.entity';
import { OfficeMode } from '../entities/officeMode.entity';
import { OfficeModeType } from '../entities/officeModeType.entity';
import { OfficePermissionType } from '../entities/officePermissionType.entity';
import { OfficeProductItem } from '../entities/officeProductItem.entity';
import { OfficeRoomCodeLog } from '../entities/officeRoomCodeLog.entity';
import { OfficeSeatInfo } from '../entities/officeSeatInfo.entity';
import { OfficeSpaceInfo } from '../entities/officeSpaceInfo.entity';
import { OfficeShowRoomInfo } from '../entities/officeShowRoomInfo.entity';
import { OfficeSpawnType } from '../entities/officeSpawnType.entity';
import { OfficeTopicType } from '../entities/officeTopicType.entity';
import { OnfContentsType } from '../entities/onfContentsType.entity';
import { OnfContentsInfo } from '../entities/onfContentsInfo.entity';
import { OfficeGradeAuthority } from '../entities/officeGradeAuthority.entity';
import { OsType } from '../entities/osType.entity';
import { RoomShortLink } from '../entities/roomShortLink.entity';
import { PackageType } from '../entities/packageType.entity';
import { PaymentProductManager } from '../entities/paymentProductManager.entity';
import { PaymentStateType } from '../entities/paymentStateType.entity';
import { PostalEffectType } from '../entities/postalEffectType.entity';
import { PostalItemProperty } from '../entities/postalItemProperty.entity';
import { PostalLog } from '../entities/postalLog.entity';
import { PostalLogType } from '../entities/postalLogType.entity';
import { PostalMoneyProperty } from '../entities/postalMoneyProperty.entity';
import { PostalState } from '../entities/postalState.entity';
import { PostalSendType } from '../entities/postalSendType.entity';
import { PostalType } from '../entities/postalType.entity';
import { PostalTypeProperty } from '../entities/postalTypeProperty.entity';
import { Postbox } from '../entities/postbox.entity';
import { PostboxAppend } from '../entities/postboxAppend.entity';
import { PostReceiveMemberInfo } from '../entities/postReceiveMemberInfo.entity';
import { ProviderType } from '../entities/providerType.entity';
import { PaymentList } from '../entities/paymentList.entity';
import { PaymentStateLog } from '../entities/paymentStateLog.entity';
import { QuizAnswerType } from '../entities/quizAnswerType.entity';
import { QuizLevel } from '../entities/quizLevel.entity';
import { QuizQuestionAnswer } from '../entities/quizQuestionAnswer.entity';
import { QuizRoundTime } from '../entities/quizRoundTime.entity';
import { QuizTimeType } from '../entities/quizTimeType.entity';
import { RegPathType } from '../entities/regPathType.entity';
import { ReportType } from '../entities/reportType.entity';
import { ReportCategory } from '../entities/reportCategory.entity';
import { ReportReasonType } from '../entities/reportReasonType.entity';
import { ReportStateType } from '../entities/reportStateType.entity';
import { ResetPasswdCount } from '../entities/resetPasswdCount.entity';
import { ResignMember } from '../entities/resignMember.entity';
import { ResignPurchaseInfo } from '../entities/resignPurchaseInfo.entity';
import { RestrictionDetail } from '../entities/restrictionDetail.entity';
import { RestrictionType } from '../entities/restrictionType.entity';
import { RoleType } from '../entities/roleType.entity';
import { SceneType } from '../entities/sceneType.entity';
import { ScreenContentType } from '../entities/screenContentType.entity';
import { ScreenInfo } from '../entities/screenInfo.entity';
import { ScreenReservation } from '../entities/screenReservation.entity';
import { SelectVoteInfo } from '../entities/selectVoteInfo.entity';
import { SelectVoteItem } from '../entities/selectVoteItem.entity';
import { SelectVoteStateType } from '../entities/selectVoteStateType.entity';
import { ServerInfo } from '../entities/serverInfo.entity';
import { ServerState } from '../entities/serverState.entity';
import { ServerType } from '../entities/serverType.entity';
import { SessionInfo } from '../entities/sessionInfo.entity';
import { SpaceDetailType } from '../entities/spaceDetailType.entity';
import { SpaceInfo } from '../entities/spaceInfo.entity';
import { SpaceType } from '../entities/spaceType.entity';
import { StartInventory } from '../entities/startInventory.entity';
import { StartMyRoom } from '../entities/startMyRoom.entity';
import { StateMessage } from '../entities/stateMessage.entity';
import { StoreType } from '../entities/storeType.entity';
import { Terms } from '../entities/terms.entity';
import { TestMember } from '../entities/testMember.entity';
import { UploadType } from '../entities/uploadType.entity';
import { User } from '../entities/user.entity';
import { VideoPlayInfo } from '../entities/videoPlayInfo.entity';
import { VideoScreenInfo } from '../entities/videoScreenInfo.entity';
import { VideoScreenStats } from '../entities/videoScreenStats.entity';
import { VideoStateType } from '../entities/videoStateType.entity';
import { VoteAlterResponse } from '../entities/voteAlterResponse.entity';
import { VoteAlterResType } from '../entities/voteAlterResType.entity';
import { Voteanswertype } from '../entities/voteAnswerType.entity';
import { VoteDivType } from '../entities/voteDivType.entity';
import { VoteInfo } from '../entities/voteInfo.entity';
import { VoteInfoExample } from '../entities/voteInfoExample.entity';
import { VoteResType } from '../entities/voteResType.entity';
import { VoteResultExposureType } from '../entities/voteResultExposureType.entity';
import { VoteResultType } from '../entities/voteResultType.entity';
import { VoteStateType } from '../entities/voteStateType.entity';
import { WorldType } from '../entities/worldType.entity';

import { OfficeAlarmType } from '../entities/officeAlarmType.entity';
import { OfficeModeSlot } from '../entities/officeModeSlot.entity';
import { ItemUseEffect } from '../entities/itemUseEffect.entity';
import { CommerceZoneItem } from '../entities/commerceZoneItem.entity';
import { LicenseGroupInfo } from '../entities/licenseGroupInfo.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      host: process.env.DB_HOSTNAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        AdContents,
        AdminLog,
        AdminType,
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
        AzureStorage,
        BannerInfo,
        BannerType,
        BannerReservation,
        BlockchainTransferEventLog,
        BooleanType,
        BoothBannerInfo,
        BoothFileBoxInfo,
        BoothScreenInfo,
        BusinessCardTemplate,
        BuySellType,
        CategoryType,
        CommerceZoneMannequin,
        CommerceZoneItem,
        CSAFEventEnterLog,
        CSAFEventInfo,
        CSAFEventBoothInfo,
        DisciplineDetail,
        DisciplineReview,
        DisciplineType,
        DepartmentType,
        DynamicLinkType,
        EachBoothBannerInfo,
        EachBoothScreenInfo,
        EmailCheck,
        EmailConfirm,
        EmailLimit,
        EnabledType,
        EventSpaceType,
        Faq,
        FileBoxType,
        Forbiddenwords,
        FunctionTable,
        Gateway,
        GradeType,
        InfiniteCodeRank,
        InteriorInstallInfo,
        InquiryTemplate,
        InquiryAnswerType,
        InquiryType,
        Item,
        ItemMaterial,
        ItemType,
        InteractionType,
        ItemUseEffect,
        JumpingMatchingGameType,
        JumpingMatchingLevel,
        KtmfEventEmailInfo,
        KtmfNftToken,
        KtmfNftTokenToWallet,
        KtmfNftTokenToWalletLog,
        KtmfSpecialItem,
        KtmfSpecialMoney,
        KtmfPassTierRatingType,
        LandType,
        LayerType,
        LicenseInfo,
        LicenseType,
        LicenseFunction,
        LicenseGroupInfo,
        LicenseTypeInfo,
        Localization,
        LogActionType,
        LogContentType,
        MannequinModelType,
        MannequinPurchaseState,
        MapExposulInfo,
        MapExposulBrand,
        MapInfoType,
        MediaExposureType,
        MediaRollingType,
        Member,
        MemberAccount,
        MemberAdContents,
        MemberAvatarInfo,
        MemberBlock,
        MemberBusinessCardInfo,
        MemberConnectInfo,
        MemberDefaultCardInfo,
        MemberFrameImage,
        MemberFriend,
        MemberFriendRequest,
        MemberFurnitureItemInven,
        MemberIdentification,
        MemberInfiniteCodeRank,
        MemberInquiry,
        MemberInquiryAnswer,
        MemberInquiryManager,
        MemberInquiryGroup,
        MemberAvatarPartsItemInven,
        MemberItemInven,
        MemberLoginLog,
        MemberLoginRewardLog,
        MemberMoney,
        MemberNicknameLog,
        MemberLicenseInfo,
        MemberMyRoomInfo,
        MemberNftRewardLog,
        MemberOfficeReservationInfo,
        MemberOfficeReservationWaitingInfo,
        MemberOfficeVisitLog,
        MemberPasswordAuth,
        MemberPostbox,
        MemberPurchaseItem,
        MemberReportInfo,
        MemberSelectVoteInfo,
        MemberSelectVoteLike,
        MemberVoteInfo,
        MemberWalletInfo,
        MemberWalletLinkLog,
        MoneyType,
        MyRoomStateType,
        NoticeExposureType,
        NoticeInfo,
        NoticeType,
        NpcArrange,
        NpcCostume,
        NpcList,
        NpcLookType,
        NpcType,
        ObjectInteractionType,
        OfficeAlarmType,
        OfficeAuthority,
        OfficeBookmark,
        OfficeDefaultOption,
        OfficeExposure,
        OfficeExposureType,
        OfficeGradeAuthority,
        OfficeGradeType,
        OfficeLicenseDomainInfo,
        OfficeMode,
        OfficeModeSlot,
        OfficeModeType,
        OfficePermissionType,
        OfficeProductItem,
        OfficeRoomCodeLog,
        OfficeSeatInfo,
        OfficeSpaceInfo,
        OfficeShowRoomInfo,
        OfficeSpawnType,
        OfficeTopicType,
        RoomShortLink,
        OnfContentsInfo,
        OnfContentsType,
        OsType,
        PackageType,
        PaymentProductManager,
        PaymentStateType,
        PostalEffectType,
        PostalItemProperty,
        PostalLog,
        PostalLogType,
        PostalMoneyProperty,
        PostalState,
        PostalSendType,
        PostalType,
        PostalTypeProperty,
        Postbox,
        PostboxAppend,
        PostReceiveMemberInfo,
        ProviderType,
        PaymentList,
        PaymentStateLog,
        QuizAnswerType,
        QuizLevel,
        QuizQuestionAnswer,
        QuizRoundTime,
        QuizTimeType,
        RegPathType,
        ReportType,
        ReportCategory,
        ReportReasonType,
        ReportStateType,
        ResetPasswdCount,
        ResignMember,
        ResignPurchaseInfo,
        RestrictionDetail,
        RestrictionType,
        RoleType,
        SceneType,
        ScreenContentType,
        ScreenInfo,
        ScreenReservation,
        SelectVoteInfo,
        SelectVoteItem,
        SelectVoteStateType,
        ServerInfo,
        ServerState,
        ServerType,
        SessionInfo,
        SpaceDetailType,
        SpaceInfo,
        SpaceType,
        StartInventory,
        StartMyRoom,
        StateMessage,
        StoreType,
        Terms,
        TestMember,
        User,
        UploadType,
        VideoPlayInfo,
        VideoScreenInfo,
        VideoScreenStats,
        VideoStateType,
        VoteAlterResponse,
        VoteAlterResType,
        Voteanswertype,
        VoteDivType,
        VoteInfo,
        VoteInfoExample,
        VoteResType,
        VoteResultExposureType,
        VoteResultType,
        VoteStateType,
        WorldType,
      ],
      synchronize: false,
      logging: true,
      ssl: {
        rejectUnauthorized: true,
      },
    }),
  ],

  providers: [...entityProviders],
  exports: [...entityProviders],
})
export class EntityModule {}
