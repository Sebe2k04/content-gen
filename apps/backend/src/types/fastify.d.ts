import "@fastify/oauth2";
import { OAuth2Namespace } from "@fastify/oauth2";

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth: OAuth2Namespace;
    githubOAuth: OAuth2Namespace;
  }
}
