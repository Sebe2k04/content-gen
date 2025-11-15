import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity({ schema: "auth" })
export class LoginOtp extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @Property()
  otp: string;

  @Property()
  isUsed: boolean;

  @Property()
  expiresAt: Date;

  constructor({
    user,
    otp,
    isUsed,
    expiresAt,
  }: {
    user: User;
    otp: string;
    isUsed: boolean;
    expiresAt: Date;
  }) {
    super();
    this.user = user;
    this.otp = otp;
    this.isUsed = isUsed;
    this.expiresAt = expiresAt;
  }
}
