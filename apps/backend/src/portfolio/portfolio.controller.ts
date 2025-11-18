// src/portfolio/portfolio.controller.ts
import { initServer } from "@ts-rest/fastify";
import { getPortfolioService } from "./portfolio.service";
import { FastifyInstance } from "fastify";
import { JwtGuard } from "../common/guards/jwt.guard";
import { pipeline } from "stream/promises";
import { contract } from "contract";

const s = initServer();

export const portfolioController = (app: FastifyInstance) => {
  const jwtGuard = JwtGuard(app);

  return s.router(contract.portfolio, {
    uploadResume: {
      handler: async ({ request, reply }) => {
        // read multipart using fastify-multipart plugin (must be registered on server)
        const mp = await request.file(); // fastify-multipart API
        if (!mp) {
          return reply.status(400).send({ message: "No file uploaded" });
        }
        const buffer = await mp.toBuffer();
        const service = await getPortfolioService();
        const user = request.user as any;
        const out = await service.uploadResume(user, {
          filename: mp.filename,
          mimetype: mp.mimetype,
          buffer,
        });
        return { status: 200, body: out };
      },
      hooks: {
        preHandler: jwtGuard.preHandler,
      },
    },

    saveManualData: {
      handler: async ({ body, request }) => {
        const user = request.user as any;
        const service = await getPortfolioService();
        await service.saveManualData(user, body);
        return { status: 200, body: { message: "Saved" } };
      },
      hooks: {
        preHandler: jwtGuard.preHandler,
      },
    },

    addProject: {
      handler: async ({ body, request }) => {
        const user = request.user as any;
        const service = await getPortfolioService();
        await service.addProject(user, body);
        return {
          status: 200,
          body: {
            message: "Project added successfully",
          },
        };
      },
      hooks: { preHandler: jwtGuard.preHandler },
    },

    updateProject: {
      handler: async ({ params, body, request }) => {
        const user = request.user as any;
        const service = await getPortfolioService();
        await service.updateProject(user, (params as any).id, body);
        return {
          status: 200,
          body: {
            message: "Project updated successfully",
          },
        };
      },
      hooks: { preHandler: jwtGuard.preHandler },
    },

    deleteProject: {
      handler: async ({ params, request }) => {
        const user = request.user as any;
        const service = await getPortfolioService();
        const out = await service.deleteProject(user, (params as any).id);
        return { status: 200, body: out };
      },
      hooks: { preHandler: jwtGuard.preHandler },
    },

    addSkill: {
      handler: async ({ body, request }) => {
        const user = request.user as any;
        const service = await getPortfolioService();
        const skill = await service.addSkill(user, body);
        return {
          status: 200,
          body: {
            message: "Skill added successfully",
          },
        };
      },
      hooks: { preHandler: jwtGuard.preHandler },
    },

    upsertIntegration: {
      handler: async ({ body, request }) => {
        const user = request.user as any;
        const service = await getPortfolioService();
        await service.upsertIntegration(user, body);
        return {
          status: 200,
          body: {
            message: "Skill updated successfully",
          },
        };
      },
      hooks: { preHandler: jwtGuard.preHandler },
    },

    setTheme: {
      handler: async ({ body, request }) => {
        const user = request.user as any;
        const service = await getPortfolioService();
        const theme = await service.setTheme(user, body);
        return {
          status: 200,
          body: {
            message: "Theme configured successfully",
          },
        };
      },
      hooks: { preHandler: jwtGuard.preHandler },
    },

    getPublicPortfolio: {
      handler: async ({ query }) => {
        const service = await getPortfolioService();
        const portfolio = await service.getPublicPortfolio(query.userId);

        // Transform the data to match the expected contract
        const transformedPortfolio = {
          id: portfolio.id,
          userId: portfolio.userId,
          name: portfolio.name,
          headline: portfolio.headline,
          bio: portfolio.bio,
          avatarUrl: portfolio.avatarUrl,
          resumeUrl: portfolio.resumeUrl,
          theme: portfolio.theme,
          skills: portfolio.skills.map((skill) => ({
            id: skill.id,
            name: skill.name,
            level: skill.level,
            tags: skill.tags || undefined,
          })),
          projects: portfolio.projects.map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            repoUrl: project.repoUrl,
            demoUrl: project.demoUrl,
          })),
          integrations: portfolio.integrations.map((integration) => ({
            id: integration.id,
            provider: integration.provider,
            profileUrl: integration.profileUrl,
            username: integration.username || null, // Convert undefined to null
            meta: integration.meta || undefined, // Convert null to undefined
          })),
        };

        return {
          status: 200,
          body: transformedPortfolio,
        };
      },
    },
  });
};
