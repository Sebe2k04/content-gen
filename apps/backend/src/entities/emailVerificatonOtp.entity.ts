import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";

@Entity({ schema: "auth" })
export class EmailVerificationOtp extends BaseEntity {
  @Property()
  email: string;

  @Property()
  otp: string;

  @Property()
  isUsed: boolean;

  @Property()
  expiresAt: Date;

  constructor({
    email,
    otp,
    isUsed,
    expiresAt,
  }: {
    email: string;
    otp: string;
    isUsed: boolean;
    expiresAt: Date;
  }) {
    super();
    this.email = email;
    this.otp = otp;
    this.isUsed = isUsed;
    this.expiresAt = expiresAt;
  }
}
