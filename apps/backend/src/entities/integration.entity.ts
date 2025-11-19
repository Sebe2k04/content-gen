import { Entity, Property, ManyToOne, Enum } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { Portfolio } from "./portfolio.entity";
import { IntegrationProvider } from "contract/enum";

@Entity({schema:"portfolio"})
export class Integration extends BaseEntity {
  @ManyToOne()
  portfolio: Portfolio;

  @Enum({ items: () => IntegrationProvider })
  provider: IntegrationProvider;

  @Property({})
  profileUrl: string;

  @Property({
    nullable: true,
  })
  username: string | null;

  @Property({
    type: "json",
    nullable: true,
  })
  meta: Record<string, any> | null;

  @Property({
    hidden: true,
    nullable: true,
  })
  encryptedCredentials: string | null;

  constructor({
    portfolio,
    provider,
    profileUrl,
    username,
    meta,
    encryptedCredentials,
  }: {
    portfolio: Portfolio;
    provider: IntegrationProvider;
    profileUrl: string;
    username?: string | null;
    meta?: Record<string, any> | null;
    encryptedCredentials?: string | null;
  }) {
    super();
    this.portfolio = portfolio;
    this.provider = provider;
    this.profileUrl = profileUrl;
    this.username = username || null;
    this.meta = meta || null;
    this.encryptedCredentials = encryptedCredentials || null;
  }
}
