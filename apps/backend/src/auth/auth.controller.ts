import { initServer } from "@ts-rest/fastify"
import { authService } from "./auth.service"
import { contract } from "contract"

const s = initServer()

export const authController = s.router(contract.auth, {
  signup: async ({ body }) => {
    const output = await authService.signup(body)
    return { status: 201, body: output }
  },

  login: async ({ body }) => {
    const output = await authService.login(body)
    return { status: 200, body: output }
  },

  generateEmailOtp: async ({ body }) => {
    await authService.generateEmailOtp(body.email)
    return { status: 200, body: { message: "OTP sent" } }
  },

  verifyEmailOtp: async ({ body }) => {
    const output = await authService.verifyEmailOtp(body.email, body.otp)
    return { status: 200, body: output }
  }
})
