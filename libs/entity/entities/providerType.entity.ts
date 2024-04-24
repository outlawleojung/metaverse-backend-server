import { Entity, OneToMany } from 'typeorm';
import { MemberAccount } from './memberAccount.entity';
import { MemberLoginLog } from './memberLoginLog.entity';
import { Member } from './member.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('provider_type')
export class ProviderType extends BaseTypeEntity {
  @OneToMany(() => Member, (member) => member.ProviderType)
  Members: Member[];

  @OneToMany(() => MemberAccount, (memberaccount) => memberaccount.ProviderType)
  MemberAccounts: MemberAccount[];

  @OneToMany(
    () => MemberLoginLog,
    (memberloginlog) => memberloginlog.ProviderType,
  )
  MemberLoginLogs: MemberLoginLog[];
}
