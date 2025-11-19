import { Entity, Property, ManyToOne, Enum } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { Portfolio } from "./portfolio.entity";
import { MediaType } from "contract/enum";

@Entity({schema:"portfolio"})
export class Resume extends BaseEntity {
  @ManyToOne()
  portfolio: Portfolio;

  @Property({})
  filename: string;

  @Enum({items:() => MediaType})
  mediaType: MediaType;

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
    mediaType,
    url,
    extractedData,
  }: {
    portfolio: Portfolio;
    filename: string;
    mediaType: MediaType;
    url: string;
    extractedData?: Record<string, any> | null;
  }) {
    super();
    this.portfolio = portfolio;
    this.filename = filename;
    this.mediaType = mediaType;
    this.url = url;
    this.extractedData = extractedData || null;
  }
}
