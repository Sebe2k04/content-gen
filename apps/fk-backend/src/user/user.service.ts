import { ServerInferRequest } from "@ts-rest/core";
import { contract } from "contract";
import { em } from "src/db";
import { User } from "src/entities/user.entity";

type EmType = typeof em;

export class AuthService {
  private static instance: AuthService;
  private em: Awaited<ReturnType<EmType["get"]>>;
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

  async getProfile(user: { id: string; email: string }) {
    const currentUser = await this.em.findOneOrFail(User, { id: user.id });
    return currentUser;
  }

  async updateProfile(
    data: ServerInferRequest<typeof contract.user.updateProfile>['body'],
    user: { id: string; email: string }
  ) {
    const currentUser = await this.em.findOneOrFail(User, { id: user.id });
    currentUser.name = data.name;
    currentUser.avatarUrl = data.avatarUrl;
    await this.em.persistAndFlush(currentUser);
    return currentUser;
  }
}

export async function getAuthService(): Promise<AuthService> {
  return AuthService.getInstance();
}
