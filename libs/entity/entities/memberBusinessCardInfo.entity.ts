import { ApiProperty } from '@nestjs/swagger';
import { BusinessCardTemplate } from './businessCardTemplate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Index('memberId', ['memberId'], {})
@Index('templateId', ['templateId'], {})
@Index('num', ['num'], {})
@Entity('member_business_card_info')
export class MemberBusinessCardInfo {
  @PrimaryColumn('uuid')
  memberId: string;

  @ApiProperty({
    example: 2,
    description: '명함 템플릿 아이디',
    required: true,
  })
  @PrimaryColumn('int')
  templateId: number;

  @PrimaryColumn('int')
  num: number;

  @ApiProperty({
    example: '한효주',
    description: '이름',
  })
  @Column('varchar', { nullable: true, length: 32 })
  name: string | null;

  @ApiProperty({
    example: '010-1234-5678',
    description: '폰번호',
  })
  @Column('varchar', { nullable: true, length: 32 })
  phone: string | null;

  @ApiProperty({
    example: 'gywngks@email.com',
    description: '이메일',
  })
  @Column('varchar', { nullable: true, length: 64 })
  email: string | null;

  @ApiProperty({
    example: '서울시 강남구 논현동 131-4 한컴프론티스',
    description: '주소',
  })
  @Column('varchar', { nullable: true, length: 128 })
  addr: string | null;

  @ApiProperty({
    example: '02-345-7786',
    description: '팩스',
  })
  @Column('varchar', { nullable: true, length: 32 })
  fax: string | null;

  @ApiProperty({
    example: '개발자',
    description: '직업',
  })
  @Column('varchar', { nullable: true, length: 32 })
  job: string | null;

  @ApiProperty({
    example: '본부장',
    description: '직책',
  })
  @Column('varchar', { nullable: true, length: 32 })
  position: string | null;

  @ApiProperty({
    example: '안녕하세요. 저는 한컴프론티스\n 개발자 입니다.',
    description: '소개글',
  })
  @Column('varchar', { nullable: true, length: 256 })
  intro: string | null;

  @ApiProperty({
    example: 'profile.png',
    description: '썸네일',
  })
  @Column('varchar', { nullable: true, length: 128 })
  thumbnail: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberBusinessCardInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(
    () => BusinessCardTemplate,
    (businesscardtemplate) => businesscardtemplate.MemberBusinessCardInfos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'templateId' })
  BusinessCardTemplate: BusinessCardTemplate;
}
