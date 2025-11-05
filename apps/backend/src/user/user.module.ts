import type { FastifyInstance } from "fastify"
import { userController } from "./user.controller"

export const userModule = async (app: FastifyInstance) => {
  await userController(app)
}
