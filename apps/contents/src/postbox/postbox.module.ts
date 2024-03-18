import { Module } from '@nestjs/common';
import { PostboxController } from './postbox.controller';
import { PostboxService } from './postbox.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  Item,
  Member,
  MemberAvatarPartsItemInven,
  MemberFurnitureItemInven,
  MemberPostbox,
  MoneyType,
  PostalEffectType,
  PostalType,
  PostboxAppend,
  SystemPostbox,
  SystemPostboxAppend,
} from '@libs/entity';
import { CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberPostbox,
      Item,
      MoneyType,
      PostalEffectType,
      PostalType,
      PostboxAppend,
      MemberFurnitureItemInven,
      MemberAvatarPartsItemInven,
      SystemPostboxAppend,
      SystemPostbox,
    ]),
    EntityModule,
    CommonModule,
  ],
  controllers: [PostboxController],
  providers: [PostboxService],
  exports: [PostboxService],
})
export class PostboxModule {}
