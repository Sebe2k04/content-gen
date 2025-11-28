import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { Portfolio } from "./portfolio.entity";

@Entity({schema:"portfolio"})
export class Project extends BaseEntity {
  @ManyToOne()
  portfolio: Portfolio;

  @Property({})
  title: string;

  @Property({
    nullable: true,
  })
  description: string | null;

  @Property({
    nullable: true,
  })
  repoUrl: string | null;

  @Property({
    nullable: true,
  })
  websiteUrl: string | null;

  @Property({
    type: "array",
  })
  technologies: string[];

  @Property({
    nullable: true,
  })
  highlight: string | null;

  constructor({
    portfolio,
    title,
    description,
    repoUrl,
    websiteUrl,
    technologies,
    highlight,
  }: {
    portfolio: Portfolio;
    title: string;
    description?: string | null;
    repoUrl?: string | null;
    websiteUrl?: string | null;
    technologies?: string[];
    highlight?: string | null;
  }) {
    super();
    this.portfolio = portfolio;
    this.title = title;
    this.description = description || null;
    this.repoUrl = repoUrl || null;
    this.websiteUrl = websiteUrl || null;
    this.technologies = technologies || [];
    this.highlight = highlight || null;
  }
}
