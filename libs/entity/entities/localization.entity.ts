import { ItemUseEffect } from './itemUseEffect.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Item } from './item.entity';
import { OfficeMode } from './officeMode.entity';
import { OfficeSpaceInfo } from './officeSpaceInfo.entity';
import { OfficeModeType } from './officeModeType.entity';
import { OfficeGradeType } from './officeGradeType.entity';
import { OfficeTopicType } from './officeTopicType.entity';
import { OfficePermissionType } from './officePermissionType.entity';
import { CategoryType } from './categoryType.entity';
import { OfficeAlarmType } from './officeAlarmType.entity';
import { AvatarPartsGroupType } from './avatarPartsGroupType.entity';
import { OfficeShowRoomInfo } from './officeShowRoomInfo.entity';
import { MapExposulInfo } from './mapExposulInfo.entity';
import { NpcList } from './npcList.entity';
import { QuizQuestionAnswer } from './quizQuestionAnswer.entity';
import { OfficeProductItem } from './officeProductItem.entity';

@Entity('localization')
export class Localization {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('text', { nullable: true })
  kor: string | null;

  @Column('text', { nullable: true })
  eng: string | null;

  @OneToMany(() => Item, (item) => item.name)
  LocalizationItemName: Item[];

  @OneToMany(() => Item, (item) => item.description)
  LocalizationItemDesc: Item[];

  @OneToMany(() => OfficeMode, (officemode) => officemode.LocalizationRoomName)
  OfficeModeRoomName: OfficeMode[];

  @OneToMany(() => OfficeMode, (officemode) => officemode.LocalizationRoomDesc)
  OfficeModeRoomDesc: OfficeMode[];

  @OneToMany(() => OfficeMode, (officemode) => officemode.LocalizationModeDesc)
  OfficeModeDesc: OfficeMode[];

  @OneToMany(
    () => OfficeSpaceInfo,
    (officespaceinfo) => officespaceinfo.LocalizationDesc,
  )
  OfficeSpaceInfoDescs: OfficeSpaceInfo[];

  @OneToMany(
    () => OfficeSpaceInfo,
    (officespaceinfo) => officespaceinfo.LocalizationName,
  )
  OfficeSpaceInfoNames: OfficeSpaceInfo[];

  @OneToMany(
    () => OfficeShowRoomInfo,
    (officeshowroominfo) => officeshowroominfo.LocalizationDesc,
  )
  OfficeShowRoomInfoDescs: OfficeSpaceInfo[];

  @OneToMany(
    () => OfficeShowRoomInfo,
    (officeshowroominfo) => officeshowroominfo.LocalizationName,
  )
  OfficeShowRoomInfoNames: OfficeSpaceInfo[];

  @OneToMany(
    () => ItemUseEffect,
    (itemuseeffect) => itemuseeffect.LocalizationChat,
  )
  ItemUseEffects: ItemUseEffect[];

  @OneToMany(
    () => OfficeModeType,
    (officemodetype) => officemodetype.LocalizationModeType,
  )
  OfficeModeTypes: OfficeModeType[];

  @OneToMany(
    () => OfficeGradeType,
    (officegradetype) => officegradetype.LocalizationName,
  )
  OfficeGradeTypes: OfficeGradeType[];

  @OneToMany(
    () => OfficeTopicType,
    (officetopictype) => officetopictype.LocalizationName,
  )
  OfficeTopicTypes: OfficeTopicType[];

  @OneToMany(
    () => OfficePermissionType,
    (officepermissiontype) => officepermissiontype.LocalizationName,
  )
  OfficePermissionTypes: OfficePermissionType[];

  @OneToMany(
    () => CategoryType,
    (categorytype) => categorytype.LocalizationName,
  )
  CategoryTypes: CategoryType[];

  @OneToMany(
    () => OfficeAlarmType,
    (officealarmtype) => officealarmtype.LocalizationName,
  )
  OfficeAlarmTypes: OfficeAlarmType[];

  @OneToMany(
    () => AvatarPartsGroupType,
    (officealarmtype) => officealarmtype.LocalizationName,
  )
  AvatarPartsGroupTypes: AvatarPartsGroupType[];

  @OneToMany(
    () => MapExposulInfo,
    (mapexposulinfo) => mapexposulinfo.LocalizationName,
  )
  MapExposulInfoNames: MapExposulInfo[];

  @OneToMany(
    () => MapExposulInfo,
    (mapexposulinfo) => mapexposulinfo.LocalizationDesc,
  )
  MapExposulInfoDescs: MapExposulInfo[];

  @OneToMany(() => NpcList, (npc) => npc.LocalizationName)
  NpcLists: NpcList[];

  @OneToMany(
    () => QuizQuestionAnswer,
    (quetion) => quetion.LocalizationQuestion,
  )
  QuizQuestionAnswer: QuizQuestionAnswer[];

  @OneToMany(() => OfficeProductItem, (product) => product.LocalizationName)
  OfficeProductItems: OfficeProductItem[];
}
