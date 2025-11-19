import { Entity, Property, ManyToOne, Enum } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { Portfolio } from "./portfolio.entity";
import { SkillLevel } from "contract/enum";

@Entity({schema:"portfolio"})
export class Skill extends BaseEntity {
  @ManyToOne()
  portfolio: Portfolio;

  @Property({})
  name: string;

  @Enum({
    items: () => SkillLevel,
  })
  level: SkillLevel;

  @Property({
    type: "json",
    nullable: true,
  })
  tags: string[] | null;

  constructor({
    portfolio,
    name,
    level,
    tags,
  }: {
    portfolio: Portfolio;
    name: string;
    level: SkillLevel;
    tags?: string[] | null;
  }) {
    super();
    this.portfolio = portfolio;
    this.name = name;
    this.level = level;
    this.tags = tags || null;
  }
}
