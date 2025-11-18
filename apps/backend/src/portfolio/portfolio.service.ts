import { em } from "src/db";
import { Resume } from "src/entities/resume.entity";
import { Portfolio } from "src/entities/portfolio.entity";
import { Project } from "src/entities/project.entity";
import { Skill } from "src/entities/skill.entity";
import { Integration } from "src/entities/integration.entity";
import { Theme } from "src/entities/theme.entity";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { BadRequestException } from "src/exceptions/http.exception";
import { User } from "src/entities/user.entity";
import { ServerInferRequest } from "@ts-rest/core";
import { contract } from "contract";
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

  // Upload PDF, save to storage and call parser
  async createResume(
    user: { id: string; email: string },
    file: { filename: string; mimetype: string; buffer: Buffer }
  ) {
    if (file.mimetype !== "application/pdf") {
      throw new BadRequestException("Only PDF resumes are allowed");
    }

    const userEntity = await this.em.findOneOrFail(User, user.id);

    // Get or create portfolio
    let portfolio = await this.em.findOneOrFail(Portfolio, {
      user: { id: user.id },
    });

    // store file (example: local storage; in prod use S3)
    const storagePath = path.join(
      process.cwd(),
      "uploads",
      "resumes",
      `${Date.now()}-${file.filename}`
    );
    await fs.mkdir(path.dirname(storagePath), { recursive: true });
    await fs.writeFile(storagePath, file.buffer);

    // parse the resume
    const extracted = await this.parsePdfResume(storagePath);

    const resume = new Resume({
      portfolio,
      filename: file.filename,
      mimeType: file.mimetype,
      storagePath,
      extractedData: extracted,
    } as any);

    await this.em.persistAndFlush(resume);

    return { resumeId: resume.id, extracted };
  }

  private async parsePdfResume(storagePath: string) {
    return {
      name: null,
      email: null,
      phone: null,
      summary: null,
      skills: [],
      education: [],
      experience: [],
    };
  }

  async createPortfolio(
    user: { id: string },
    data: ServerInferRequest<typeof contract.portfolio.createPortfolio>["body"]
  ) {
    const userEntity = await this.em.findOneOrFail(User, user.id);
    const portfolio = new Portfolio({
      user: userEntity,
      name: data.name,
      headline: data.headline || null,
      bio: data.bio || null,
      avatarUrl: data.avatarUrl || null,
      projects: [],
      skills: [],
      integrations: [],
    });
    await this.em.persistAndFlush(portfolio);
    return { message: "Saved" };
  }

  async addProject(
    user: { id: string },
    data: ServerInferRequest<typeof contract.portfolio.addProject>["body"]
  ) {
    const portfolio = await this.em.findOneOrFail(Portfolio, {
      user: { id: user.id },
    });
    const project = new Project({
      portfolio,
      title: data.title,
      description: data.description,
      repoUrl: data.repoUrl,
      demoUrl: data.demoUrl,
      technologies: data.technologies,
      highlight: data.highlight,
    });
    await this.em.persistAndFlush(project);
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      repoUrl: project.repoUrl,
      demoUrl: project.demoUrl,
      technologies: project.technologies,
      highlight: project.highlight,
    };
  }

  async updateProject(
    user: { id: string },
    id: string,
    data: ServerInferRequest<typeof contract.portfolio.updateProject>["body"]
  ) {
    const project = await this.em.findOneOrFail(Project, {
      id,
      portfolio: { user: { id: user.id } },
    });

    project.title = data.title;
    project.description = data.description;
    project.repoUrl = data.repoUrl;
    project.demoUrl = data.demoUrl;
    project.technologies = data.technologies || []; // Convert null to undefined
    project.highlight = data.highlight || null;

    await this.em.persistAndFlush(project);
    return project;
  }

  async deleteProject(user: { id: string }, id: string) {
    const project = await this.em.findOneOrFail(Project, {
      id,
      portfolio: { user: { id: user.id } },
    });
    await this.em.removeAndFlush(project);
    return { message: "Deleted" };
  }

  async addSkill(
    user: { id: string },
    data: ServerInferRequest<typeof contract.portfolio.addSkill>["body"]
  ) {
    const portfolio = await this.em.findOneOrFail(Portfolio, {
      user: { id: user.id },
    });
    const skill = new Skill({
      portfolio,
      name: data.name,
      level: data.level ?? undefined, // Convert null to undefined to match the schema
      tags: data.tags,
    });
    await this.em.persistAndFlush(skill);
    return skill;
  }

  async upsertIntegration(
    user: { id: string },
    data: ServerInferRequest<
      typeof contract.portfolio.upsertIntegration
    >["body"]
  ) {
    const portfolio = await this.em.findOneOrFail(Portfolio, {
      user: { id: user.id },
    });
    // simple upsert by provider+profileUrl
    let existing = await this.em.findOne(Integration, {
      portfolio: { id: portfolio.id },
      provider: data.provider,
      profileUrl: data.profileUrl,
    });
    if (!existing) {
      existing = new Integration({ portfolio, ...data } as any);
    } else {
      existing.username = data.username ?? existing.username;
      existing.meta = data.meta ?? existing.meta;
    }
    await this.em.persistAndFlush(existing);
    return existing;
  }

  async setTheme(
    user: { id: string },
    data: { key: string; displayName: string; settings?: any }
  ) {
    let theme = await this.em.findOne(Theme, { key: data.key });
    if (!theme) {
      theme = new Theme({
        key: data.key,
        displayName: data.displayName,
        settings: data.settings ?? {},
      });
      await this.em.persistAndFlush(theme);
    }
    const portfolio = await this.em.findOneOrFail(Portfolio, {
      user: { id: user.id },
    });
    portfolio.theme = theme;
    await this.em.persistAndFlush(portfolio);
    return theme;
  }

  async getPublicPortfolio(userId: string) {
    const portfolio = await this.em.findOne(
      Portfolio,
      { user: { id: userId } },
      { populate: ["projects", "skills", "integrations", "theme", "resume"] }
    );
    if (!portfolio) {
      throw new BadRequestException("No portfolio found");
    }

    // Convert collections to plain JavaScript arrays
    const skills = portfolio.skills.getItems().map((skill) => ({
      id: skill.id,
      name: skill.name,
      level: skill.level,
      tags: skill.tags,
    }));

    const projects = portfolio.projects.getItems().map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      repoUrl: project.repoUrl,
      demoUrl: project.demoUrl,
      technologies: project.technologies,
      highlight: project.highlight,
    }));

    const integrations = portfolio.integrations
      .getItems()
      .map((integration) => ({
        id: integration.id,
        provider: integration.provider,
        profileUrl: integration.profileUrl,
        username: integration.username,
        meta: integration.meta,
      }));

    // map to public response
    return {
      id: portfolio.id,
      userId,
      name: portfolio.name,
      headline: portfolio.headline,
      bio: portfolio.bio,
      avatarUrl: portfolio.avatarUrl,
      skills,
      projects,
      integrations,
      theme: portfolio.theme
        ? {
            id: portfolio.theme.id,
            key: portfolio.theme.key,
            displayName: portfolio.theme.displayName,
            settings: portfolio.theme.settings || undefined,
          }
        : null,
      resumeUrl: portfolio.resume?.url || null,
    };
  }
}

export async function getPortfolioService() {
  return PortfolioService.getInstance();
}
