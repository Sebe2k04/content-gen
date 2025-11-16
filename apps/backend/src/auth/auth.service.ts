import jwt from "jsonwebtoken";
import { em } from "src/db";
import { EmailVerificationOtp } from "src/entities/emailVerificatonOtp.entity";
import { User } from "src/entities/user.entity";
import { BadRequestException } from "src/exceptions/http.exception";

type EmType = typeof em;

export class AuthService {
  private static instance: AuthService;
  private em: Awaited<ReturnType<EmType['get']>>;
  private constructor(private dbEm: EmType) {
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtp = new EmailVerificationOtp({
      email,
      otp,
      isUsed: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    await this.em.persistAndFlush(newOtp);
  }

  async verifyEmailOtp(email: string, otp: string) {
    const otpRecord = await this.em.findOne(EmailVerificationOtp, { email, otp });
    if (!otpRecord || otpRecord.isUsed || otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    otpRecord.isUsed = true;
    await this.em.persistAndFlush(otpRecord);
    return this.issueTokens({ id: "user-1", email });
  }

  private issueTokens(payload: { id: string; email: string }) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    return { accessToken, user: payload };
  }
}

export async function getAuthService(): Promise<AuthService> {
  return AuthService.getInstance();
}
