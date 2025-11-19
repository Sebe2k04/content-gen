import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { isAuthenticatedRequest } from "../types/auth";

export class UnauthorizedError extends Error {
  statusCode = 401;
  constructor() {
    super("User not authenticated");
    this.name = "UnauthorizedError";
  }
}

export function JwtGuard(app: FastifyInstance) {
  return {
    preHandler: async (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => {
      try {
        await new Promise<void>((resolve, reject) => {
          app.authenticate(request, reply, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });

        // Use our type guard to ensure the request is authenticated
        if (!isAuthenticatedRequest(request)) {
          throw new UnauthorizedError();
        }
        return;
      } catch (err: any) {
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: err?.message ?? "Invalid token",
        });
      }
    },
  };
}
