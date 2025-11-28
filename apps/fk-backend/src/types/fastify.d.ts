import "@fastify/oauth2";
import { OAuth2Namespace } from "@fastify/oauth2";

import { JwtUser } from '../common/types/auth';

declare module "fastify" {
  interface FastifyRequest {
    user?: JwtUser; // Optional for unauthenticated routes
    [key: string]: any;
  }
  
  interface FastifyInstance {
    googleOAuth: OAuth2Namespace;
    githubOAuth: OAuth2Namespace;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error) => void
    ) => void;
  }
}

// This tells TypeScript that after JWT authentication, the user property will exist
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: User;
  }
}
