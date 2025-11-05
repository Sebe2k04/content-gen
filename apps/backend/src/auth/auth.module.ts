import type { FastifyInstance } from "fastify"
import { authController } from "./auth.controller"
import { initServer } from "@ts-rest/fastify"

const s = initServer()

// export const authModule = async (app: FastifyInstance) => {
//   app.register(s.plugin(authController),{
//     responseValidation: true
//   })
// }
