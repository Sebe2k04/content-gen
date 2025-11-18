// src/portfolio/portfolio.module.ts
import type { FastifyInstance } from "fastify";
import { portfolioController } from "./portfolio.controller";
import { initServer } from "@ts-rest/fastify";
const s = initServer();

export const portfolioModule = async (app: FastifyInstance) => {
  app.register(s.plugin(portfolioController(app)), {
    responseValidation: true,
  });
};
