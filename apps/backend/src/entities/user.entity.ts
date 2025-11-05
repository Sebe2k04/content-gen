import { Entity, Property, Unique, Index } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity()
@Index({ properties: ['email'], name: 'user_email_index' })
@Unique({ properties: ['email'], name: 'user_email_unique' })
export class User extends BaseEntity {
  @Property({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Property({
    type: 'varchar',
    length: 255,
    nullable: false,
    hidden: true,
  })
  password!: string;

  @Property({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;

  @Property({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  avatar?: string;

  @Property({
    type: 'boolean',
    default: false,
    name: 'is_verified',
  })
  isVerified = false;

  @Property({
    type: 'jsonb',
    nullable: true,
    default: null,
  })
  preferences: Record<string, any> | null = null;

  @Property({
    type: 'timestamptz',
    nullable: true,
    name: 'last_login_at',
  })
  lastLoginAt?: Date;
}
