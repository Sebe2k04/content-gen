import { Entity, Property, Unique, Index } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";

@Entity()
export class User extends BaseEntity {
  @Unique()
  @Index()
  @Property({})
  email: string;

  @Property({
    hidden: true,
  })
  password: string;

  @Property({})
  name: string;

  @Property({
    nullable: true,
  })
  avatarUrl: string | null;

  constructor({
    email,
    password,
    name,
    avatarUrl,
  }: {
    email: string;
    password: string;
    name: string;
    avatarUrl?: string | null;
  }) {
    super();
    this.email = email;
    this.password = password;
    this.name = name;
    this.avatarUrl = avatarUrl || null;
  }
}
