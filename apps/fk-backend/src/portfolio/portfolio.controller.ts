import { initServer } from "@ts-rest/fastify";
import { FastifyInstance } from "fastify";
import { JwtGuard } from "../common/guards/jwt.guard";
import { contract } from "contract";
import { AuthenticatedRequest } from "src/types/auth";
import { getPortfolioService } from "./portfolio.service";

const s = initServer();

export const portfolioController = (app: FastifyInstance) => {
  const jwtGuard = JwtGuard(app);

  return s.router(contract.portfolio, {
    getAllPortfolio: {
      handler: async ({ request, reply }) => {
        const portfolioService = await getPortfolioService();
        const out = await portfolioService.getAllPortfolio(
          (request as AuthenticatedRequest).user
        );
        return {
          status: 200,
          body: out,
        };
      },
      hooks: {
        preHandler: jwtGuard.preHandler,
      },
    },
    createPortfolio: {
      handler: async ({ body, request, reply }) => {
        const portfolioService = await getPortfolioService();
        const out = await portfolioService.createPortfolio(
          (request as AuthenticatedRequest).user
        );
        return {
          status: 200,
          body: {
            message: "Portfolio created successfully",
          },
        };
      },
      hooks: {
        preHandler: jwtGuard.preHandler,
      },
    },
    editPortfolio: {
      handler: async ({ body, request, reply }) => {
        const portfolioService = await getPortfolioService();
        const out = await portfolioService.editPortfolio(
          (request as AuthenticatedRequest).user,
          body
        );
        return {
          status: 200,
          body: {
            message: "Portfolio updated successfully",
          },
        };
      },
      hooks: {
        preHandler: jwtGuard.preHandler,
      },
    },
    // createResume: {
    //   handler: async ({ body, request, reply }) => {
    //     const portfolioService = await getPortfolioService();
    //     const out = await portfolioService.createResume(
    //       (request as AuthenticatedRequest).user,
    //       body
    //     );
    //     return { status: 200, body: out };
    //   },
    //   hooks: {
    //     preHandler: jwtGuard.preHandler,
    //   },
    // },

    // createPortfolio: {
    //   handler: async ({ body, request }) => {
    //     const portfolioService = await getPortfolioService();
    //     await portfolioService.createPortfolio(
    //       (request as AuthenticatedRequest).user,
    //       body
    //     );
    //     return { status: 200, body: { message: "Saved" } };
    //   },
    //   hooks: {
    //     preHandler: jwtGuard.preHandler,
    //   },
    // },

    // addProject: {
    //   handler: async ({ body, request }) => {
    //     const portfolioService = await getPortfolioService();
    //     await portfolioService.addProject(
    //       (request as AuthenticatedRequest).user,
    //       body
    //     );
    //     return {
    //       status: 200,
    //       body: {
    //         message: "Project added successfully",
    //       },
    //     };
    //   },
    //   hooks: { preHandler: jwtGuard.preHandler },
    // },

    // updateProject: {
    //   handler: async ({ params, body, request }) => {
    //     const portfolioService = await getPortfolioService();
    //     await portfolioService.updateProject(
    //       (request as AuthenticatedRequest).user,
    //       (params as any).id,
    //       body
    //     );
    //     return {
    //       status: 200,
    //       body: {
    //         message: "Project updated successfully",
    //       },
    //     };
    //   },
    //   hooks: { preHandler: jwtGuard.preHandler },
    // },

    // deleteProject: {
    //   handler: async ({ params, request }) => {
    //     const portfolioService = await getPortfolioService();
    //     const out = await portfolioService.deleteProject(
    //       (request as AuthenticatedRequest).user,
    //       (params as any).id
    //     );
    //     return { status: 200, body: out };
    //   },
    //   hooks: { preHandler: jwtGuard.preHandler },
    // },

    // addSkill: {
    //   handler: async ({ body, request }) => {
    //     const portfolioService = await getPortfolioService();
    //     await portfolioService.addSkill(
    //       (request as AuthenticatedRequest).user,
    //       body
    //     );
    //     return {
    //       status: 200,
    //       body: {
    //         message: "Skill added successfully",
    //       },
    //     };
    //   },
    //   hooks: { preHandler: jwtGuard.preHandler },
    // },

    // upsertIntegration: {
    //   handler: async ({ body, request }) => {
    //     const portfolioService = await getPortfolioService();
    //     await portfolioService.upsertIntegration(
    //       (request as AuthenticatedRequest).user,
    //       body
    //     );
    //     return {
    //       status: 200,
    //       body: {
    //         message: "Skill updated successfully",
    //       },
    //     };
    //   },
    //   hooks: { preHandler: jwtGuard.preHandler },
    // },

    // setTheme: {
    //   handler: async ({ body, request }) => {
    //     const portfolioService = await getPortfolioService();
    //     await portfolioService.setTheme(
    //       (request as AuthenticatedRequest).user,
    //       body
    //     );
    //     return {
    //       status: 200,
    //       body: {
    //         message: "Theme configured successfully",
    //       },
    //     };
    //   },
    //   hooks: { preHandler: jwtGuard.preHandler },
    // },

    // getPublicPortfolio: {
    //   handler: async ({ query }) => {
    //     const portfolioService = await getPortfolioService();
    //     const portfolio = await portfolioService.getPublicPortfolio(
    //       query.userId
    //     );

    //     const transformedPortfolio = {
    //       id: portfolio.id,
    //       userId: portfolio.userId,
    //       name: portfolio.name,
    //       headline: portfolio.headline,
    //       bio: portfolio.bio,
    //       avatarUrl: portfolio.avatarUrl,
    //       resumeUrl: portfolio.resumeUrl,
    //       theme: portfolio.theme,
    //       skills: portfolio.skills.map((skill) => ({
    //         id: skill.id,
    //         name: skill.name,
    //         level: skill.level,
    //         tags: skill.tags || undefined,
    //       })),
    //       projects: portfolio.projects.map((project) => ({
    //         id: project.id,
    //         title: project.title,
    //         description: project.description,
    //         repoUrl: project.repoUrl,
    //         demoUrl: project.demoUrl,
    //       })),
    //       integrations: portfolio.integrations.map((integration) => ({
    //         id: integration.id,
    //         provider: integration.provider,
    //         profileUrl: integration.profileUrl,
    //         username: integration.username || null, // Convert undefined to null
    //         meta: integration.meta || undefined, // Convert null to undefined
    //       })),
    //     };

    //     return {
    //       status: 200,
    //       body: transformedPortfolio,
    //     };
    //   },
    // },
  });
};
