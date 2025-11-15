import { EntityManager } from "@mikro-orm/postgresql";
import jwt from "jsonwebtoken";
import { em } from "src/db";
import { User } from "src/entities/user.entity";

type EmType = typeof em;

export class AuthService {
  private static instance: AuthService;
  private em: Awaited<ReturnType<EmType['get']>>;
  
  private constructor(private dbEm: EmType) {
    // We'll initialize this in the init method
    this.em = null as any;
  }

  public static async getInstance(): Promise<AuthService> {
    if (!AuthService.instance) {
      const instance = new AuthService(em);
      await instance.init();
      AuthService.instance = instance;
    }
    return AuthService.instance;
  }

  private async init(): Promise<void> {
    this.em = await this.dbEm.get();
  }


  async signup(data: { email: string; password: string }) {
    const user = new User({
      email: data.email,
      password: data.password,
      name: "Anonymous",
    });
    await this.em.persistAndFlush(user);
    return this.issueTokens({ id: user.id, email: data.email });
  }

  async login(data: { email: string; password: string }) {
    const user = await this.em.findOneOrFail(User, { email: data.email });
    return this.issueTokens({ id: user.id, email: data.email });
  }

  async generateEmailOtp(email: string) {
    console.log(`OTP generated for ${email}`);
  }

  async verifyEmailOtp(email: string, otp: string) {
    return this.issueTokens({ id: "user-1", email });
  }

  private issueTokens(payload: { id: string; email: string }) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    return { accessToken, user: payload };
  }
}

// Export a function to get the auth service instance
export async function getAuthService(): Promise<AuthService> {
  return AuthService.getInstance();
}
