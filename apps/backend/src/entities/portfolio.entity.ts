import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
} from "@mikro-orm/core";
import { Collection } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Project } from "./project.entity";
import { Resume } from "./resume.entity";
import { Theme } from "./theme.entity";
import { Integration } from "./integration.entity";
import { Skill } from "./skill.entity";

@Entity()
export class Portfolio extends BaseEntity {
  @ManyToOne()
  user: User;

  @Property({})
  name: string;

  @Property({
    nullable: true,
  })
  headline: string | null;

  @Property({
    nullable: true,
  })
  bio: string | null;

  @Property({
    nullable: true,
  })
  avatarUrl: string | null;

  @ManyToOne(() => Resume, { nullable: true })
  resume: Resume | null;

  @OneToMany(() => Project, (p) => p.portfolio)
  projects: Collection<Project>;

  @OneToMany(() => Skill, (s) => s.portfolio)
  skills: Collection<Skill>;

  @OneToMany(() => Integration, (i) => i.portfolio)
  integrations: Collection<Integration>;

  @ManyToOne(() => Theme, { nullable: true })
  theme: Theme | null;

  constructor({
    user,
    name,
    resume,
    headline,
    bio,
    avatarUrl,
    theme,
    projects,
    skills,
    integrations,
  }: {
    user: User;
    name: string;
    resume?: Resume | null;
    headline?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    theme?: Theme | null;
    projects: Project[];
    skills: Skill[];
    integrations: Integration[];
  }) {
    super();

    this.user = user;
    this.name = name;
    this.resume = resume || null;
    this.headline = headline || null;
    this.bio = bio || null;
    this.avatarUrl = avatarUrl || null;
    this.theme = theme || null;

    // Initialize Collections here
    this.projects = new Collection<Project>(this,projects);
    this.skills = new Collection<Skill>(this,skills);
    this.integrations = new Collection<Integration>(this,integrations);
  }
}
