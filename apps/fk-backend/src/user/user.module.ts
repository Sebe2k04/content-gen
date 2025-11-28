import type { FastifyInstance } from "fastify"
import { userController } from "./user.controller"
import { initServer } from "@ts-rest/fastify"

const s = initServer()

export const userModule = async (app: FastifyInstance) => {
  app.register(s.plugin(userController(app)), {
    responseValidation: true,
  });
};
