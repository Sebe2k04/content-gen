import { initServer } from "@ts-rest/fastify";
import { contract } from "contract";
import { getAuthService } from "./user.service";
import { FastifyInstance } from "fastify";
import { JwtGuard } from "../common/guards/jwt.guard";
import { AuthenticatedRequest } from "../types/auth"; // Update the import path
const s = initServer();
export const makeTsRestPreHandler =
  (jwtGuard: ReturnType<typeof JwtGuard>) =>
  async ({ request, response }: any) => {
    return jwtGuard.preHandler(request, response);
  };

export const userController = (app: FastifyInstance) => {
  const jwtGuard = JwtGuard(app);
  const preHandler = makeTsRestPreHandler(jwtGuard);

  return s.router(contract.user, {
    getProfile: {
      handler: async ({ request }) => {
        const authService = await getAuthService();
        console.log("testing enter");
        // TypeScript now knows request is AuthenticatedRequest in this handler
        const output = await authService.getProfile(
          (request as AuthenticatedRequest).user
        );
        return { status: 200, body: output };
      },
      hooks: {
        preHandler,
      },
    },
    updateProfile: {
      handler: async ({ body, request }) => {
        const authService = await getAuthService();
        // TypeScript now knows request is AuthenticatedRequest in this handler
        await authService.updateProfile(
          body,
          (request as AuthenticatedRequest).user
        );
        return {
          status: 200,
          body: { message: "Profile updated successfully" },
        };
      },
      hooks: {
        preHandler: jwtGuard.preHandler, // Add this if you want to protect the route
      },
    },
  });
};
