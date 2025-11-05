import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({
    defaultRaw: 'now()',
    columnType: 'timestamptz',
    type: 'timestamptz',
  })
  createdAt: Date = new Date();

  @Property({
    defaultRaw: 'now()',
    columnType: 'timestamptz',
    type: 'timestamptz',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

  @Property({
    nullable: true,
    columnType: 'timestamptz',
    type: 'timestamptz',
  })
  deletedAt?: Date;
}
