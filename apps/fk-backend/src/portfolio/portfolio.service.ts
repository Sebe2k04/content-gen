import { em } from "src/db";
import { Portfolio } from "src/entities/portfolio.entity";
import { Project } from "src/entities/project.entity";
import { Skill } from "src/entities/skill.entity";
import { Integration } from "src/entities/integration.entity";
import { BadRequestException } from "src/exceptions/http.exception";
import { User } from "src/entities/user.entity";
import { ServerInferRequest } from "@ts-rest/core";
import { contract } from "contract";
import { PortfolioTab } from "contract/enum";
type EmType = typeof em;

export class PortfolioService {
  private static instance: PortfolioService;
  private em: Awaited<ReturnType<EmType["get"]>>;
  private constructor(private dbEm: EmType) {
    this.em = null as any;
  }
  static async getInstance() {
    if (!PortfolioService.instance) {
      const instance = new PortfolioService(em);
      await instance.init();
      PortfolioService.instance = instance;
    }
    return PortfolioService.instance;
  }

  private async init(): Promise<void> {
    this.em = await this.dbEm.get();
  }

  async getAllPortfolio(user: { id: string }) {
    const portfolios = await this.em.find(Portfolio, {
      user: { id: user.id },
    });
    return {
      portfolios: portfolios.map((portfolio) => ({
        id: portfolio.id,
        name: portfolio.name,
      })),
    };
  }

  async createPortfolio(user: { id: string }) {
    const userEntity = await this.em.findOneOrFail(User, user.id);
    const newPortfolio = new Portfolio({
      user: userEntity,
      name: "My Portfolio",
      projects: [],
      skills: [],
      integrations: [],
    });
    await this.em.persistAndFlush(newPortfolio);
  }

  async editPortfolio(
    user: { id: string; email: string },
    data: ServerInferRequest<typeof contract.portfolio.editPortfolio>["body"]
  ) {
    const portfolio = await this.em.findOneOrFail(Portfolio, {
      user: { id: user.id },
    });
    switch (data.tab) {
      case PortfolioTab.PersonalInfo:
        portfolio.name = data.name;
        portfolio.headline = data.headline;
        portfolio.bio = data.bio;
        portfolio.avatarUrl = data.avatarUrl;
        portfolio.about = data.about;
        portfolio.roles = data.roles ?? [];
        break;
      case PortfolioTab.Projects:
        const projects = data.projects;
        if (projects.length > 0) {
          await this.em.nativeDelete(Project, {
            portfolio: portfolio,
          });
          for (const project of projects) {
            const newProject = new Project({
              portfolio: portfolio,
              title: project.title,
              description: project.description,
              repoUrl: project.repoUrl,
              websiteUrl: project.websiteUrl,
            });
            this.em.persist(newProject);
          }
        }
        break;
      case PortfolioTab.Skills:
        const skills = data.skills;
        if (skills.length > 0) {
          await this.em.nativeDelete(Skill, {
            portfolio: portfolio,
          });
          for (const skill of skills) {
            const newSkill = new Skill({
              portfolio: portfolio,
              name: skill.name,
              level: skill.level,
              tags: skill.tags,
            });
            this.em.persist(newSkill);
          }
        }
        break;
      case PortfolioTab.Integrations:
        const integrations = data.integrations;
        if (integrations.length > 0) {
          await this.em.nativeDelete(Integration, {
            portfolio: portfolio,
          });
          for (const integration of integrations) {
            const newIntegration = new Integration({
              portfolio: portfolio,
              provider: integration.provider,
              profileUrl: integration.profileUrl,
              username: integration.username,
              meta: integration.meta,
            });
            this.em.persist(newIntegration);
          }
        }
        break;
      case PortfolioTab.Theme:
        // it will be handled in future
        break;
      default:
        throw new BadRequestException("Invalid tab");
    }
    this.em.persist(portfolio);
    await this.em.flush();
  }

  // Upload PDF, save to storage and call parser
  // async createResume(
  //   user: { id: string; email: string },
  //   data: ServerInferRequest<typeof contract.portfolio.createResume>["body"]
  // ) {
  //   if (data.mediaType !== MediaType.PDF) {
  //     throw new BadRequestException("Only PDF resumes are allowed");
  //   }
  //   let portfolio = await this.em.findOneOrFail(Portfolio, {
  //     user: { id: user.id },
  //   });

  //   // todo:parse the resume
  //   const extracted = await this.parsePdfResume(data.url);

  //   const resume = new Resume({
  //     portfolio,
  //     filename: data.filename,
  //     mimeType: data.mediaType,
  //     url: data.url,
  //     extractedData: extracted,
  //   } as any);

  //   await this.em.persistAndFlush(resume);

  //   return { resumeId: resume.id, extracted };
  // }

  // private async parsePdfResume(url: string) {
  //   return {
  //     name: null,
  //     email: null,
  //     phone: null,
  //     summary: null,
  //     skills: [],
  //     education: [],
  //     experience: [],
  //   };
  // }

  // async createPortfolio(
  //   user: { id: string },
  //   data: ServerInferRequest<typeof contract.portfolio.createPortfolio>["body"]
  // ) {
  //   const userEntity = await this.em.findOneOrFail(User, user.id);
  //   const portfolio = new Portfolio({
  //     user: userEntity,
  //     name: data.name,
  //     headline: data.headline || null,
  //     bio: data.bio || null,
  //     avatarUrl: data.avatarUrl || null,
  //     projects: [],
  //     skills: [],
  //     integrations: [],
  //   });
  //   await this.em.persistAndFlush(portfolio);
  //   return { message: "Saved" };
  // }

  // async addProject(
  //   user: { id: string },
  //   data: ServerInferRequest<typeof contract.portfolio.addProject>["body"]
  // ) {
  //   const portfolio = await this.em.findOneOrFail(Portfolio, {
  //     user: { id: user.id },
  //   });
  //   const project = new Project({
  //     portfolio,
  //     title: data.title,
  //     description: data.description,
  //     repoUrl: data.repoUrl,
  //     demoUrl: data.demoUrl,
  //     technologies: data.technologies,
  //     highlight: data.highlight,
  //   });
  //   await this.em.persistAndFlush(project);
  //   return {
  //     id: project.id,
  //     title: project.title,
  //     description: project.description,
  //     repoUrl: project.repoUrl,
  //     demoUrl: project.demoUrl,
  //     technologies: project.technologies,
  //     highlight: project.highlight,
  //   };
  // }

  // async updateProject(
  //   user: { id: string },
  //   id: string,
  //   data: ServerInferRequest<typeof contract.portfolio.updateProject>["body"]
  // ) {
  //   const project = await this.em.findOneOrFail(Project, {
  //     id,
  //     portfolio: { user: { id: user.id } },
  //   });

  //   project.title = data.title;
  //   project.description = data.description;
  //   project.repoUrl = data.repoUrl;
  //   project.demoUrl = data.demoUrl;
  //   project.technologies = data.technologies || []; // Convert null to undefined
  //   project.highlight = data.highlight || null;

  //   await this.em.persistAndFlush(project);
  //   return project;
  // }

  // async deleteProject(user: { id: string }, id: string) {
  //   const project = await this.em.findOneOrFail(Project, {
  //     id,
  //     portfolio: { user: { id: user.id } },
  //   });
  //   await this.em.removeAndFlush(project);
  //   return { message: "Deleted" };
  // }

  // async addSkill(
  //   user: { id: string },
  //   data: ServerInferRequest<typeof contract.portfolio.addSkill>["body"]
  // ) {
  //   const portfolio = await this.em.findOneOrFail(Portfolio, {
  //     user: { id: user.id },
  //   });
  //   const skill = new Skill({
  //     portfolio,
  //     name: data.name,
  //     level: data.level ?? undefined, // Convert null to undefined to match the schema
  //     tags: data.tags,
  //   });
  //   await this.em.persistAndFlush(skill);
  //   return skill;
  // }

  // async upsertIntegration(
  //   user: { id: string },
  //   data: ServerInferRequest<
  //     typeof contract.portfolio.upsertIntegration
  //   >["body"]
  // ) {
  //   const portfolio = await this.em.findOneOrFail(Portfolio, {
  //     user: { id: user.id },
  //   });
  //   // simple upsert by provider+profileUrl
  //   let existing = await this.em.findOne(Integration, {
  //     portfolio: { id: portfolio.id },
  //     provider: data.provider,
  //     profileUrl: data.profileUrl,
  //   });
  //   if (!existing) {
  //     existing = new Integration({ portfolio, ...data } as any);
  //   } else {
  //     existing.username = data.username ?? existing.username;
  //     existing.meta = data.meta ?? existing.meta;
  //   }
  //   await this.em.persistAndFlush(existing);
  //   return existing;
  // }

  // async setTheme(
  //   user: { id: string },
  //   data: { key: string; displayName: string; settings?: any }
  // ) {
  //   let theme = await this.em.findOne(Theme, { key: data.key });
  //   if (!theme) {
  //     theme = new Theme({
  //       key: data.key,
  //       displayName: data.displayName,
  //       settings: data.settings ?? {},
  //     });
  //     await this.em.persistAndFlush(theme);
  //   }
  //   const portfolio = await this.em.findOneOrFail(Portfolio, {
  //     user: { id: user.id },
  //   });
  //   portfolio.theme = theme;
  //   await this.em.persistAndFlush(portfolio);
  //   return theme;
  // }

  // async getPublicPortfolio(userId: string) {
  //   const portfolio = await this.em.findOne(
  //     Portfolio,
  //     { user: { id: userId } },
  //     { populate: ["projects", "skills", "integrations", "theme", "resume"] }
  //   );
  //   if (!portfolio) {
  //     throw new BadRequestException("No portfolio found");
  //   }

  //   // Convert collections to plain JavaScript arrays
  //   const skills = portfolio.skills.getItems().map((skill) => ({
  //     id: skill.id,
  //     name: skill.name,
  //     level: skill.level,
  //     tags: skill.tags,
  //   }));

  //   const projects = portfolio.projects.getItems().map((project) => ({
  //     id: project.id,
  //     title: project.title,
  //     description: project.description,
  //     repoUrl: project.repoUrl,
  //     demoUrl: project.demoUrl,
  //     technologies: project.technologies,
  //     highlight: project.highlight,
  //   }));

  //   const integrations = portfolio.integrations
  //     .getItems()
  //     .map((integration) => ({
  //       id: integration.id,
  //       provider: integration.provider,
  //       profileUrl: integration.profileUrl,
  //       username: integration.username,
  //       meta: integration.meta,
  //     }));

  //   // map to public response
  //   return {
  //     id: portfolio.id,
  //     userId,
  //     name: portfolio.name,
  //     headline: portfolio.headline,
  //     bio: portfolio.bio,
  //     avatarUrl: portfolio.avatarUrl,
  //     skills,
  //     projects,
  //     integrations,
  //     theme: portfolio.theme
  //       ? {
  //           id: portfolio.theme.id,
  //           key: portfolio.theme.key,
  //           displayName: portfolio.theme.displayName,
  //           settings: portfolio.theme.settings || undefined,
  //         }
  //       : null,
  //     resumeUrl: portfolio.resume?.url || null,
  //   };
  // }
}

export async function getPortfolioService() {
  return PortfolioService.getInstance();
}
