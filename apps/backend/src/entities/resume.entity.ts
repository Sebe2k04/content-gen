import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { Portfolio } from "./portfolio.entity";

@Entity()
export class Resume extends BaseEntity {
  @ManyToOne()
  portfolio: Portfolio;

  @Property({})
  filename: string;

  @Property({})
  mimeType: string;

  @Property({})
  url: string;

  @Property({
    type: "json",
    nullable: true,
  })
  extractedData: Record<string, any> | null;

  constructor({
    portfolio,
    filename,
    mimeType,
    url,
    extractedData,
  }: {
    portfolio: Portfolio;
    filename: string;
    mimeType: string;
    url: string;
    extractedData?: Record<string, any> | null;
  }) {
    super();
    this.portfolio = portfolio;
    this.filename = filename;
    this.mimeType = mimeType;
    this.url = url;
    this.extractedData = extractedData || null;
  }
}
