import jwt from "jsonwebtoken"

export class AuthService {
  async signup(data: { email: string; password: string }) {
    // TODO: create user in DB
    return this.issueTokens({ id: "user-1", email: data.email })
  }

  async login(data: { email: string; password: string }) {
    // TODO: validate password from DB
    return this.issueTokens({ id: "user-1", email: data.email })
  }

  async generateEmailOtp(email: string) {
    // TODO: store OTP in DB / redis / keydb etc
    console.log(`OTP generated for ${email}`)
  }

  async verifyEmailOtp(email: string, otp: string) {
    // TODO: verify OTP
    return this.issueTokens({ id: "user-1", email })
  }

  private issueTokens(payload: { id: string; email: string }) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" })
    return { accessToken, user: payload }
  }
}

export const authService = new AuthService()
