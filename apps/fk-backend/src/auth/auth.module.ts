import type { FastifyInstance } from "fastify"
import { authController } from "./auth.controller"
import { initServer } from "@ts-rest/fastify"
import fastifyOauth2 from "@fastify/oauth2";
import fastifyCookie from "@fastify/cookie";

const s = initServer()

export const authModule = async (app: FastifyInstance) => {
  // cookie required
  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET!,
    hook: "preHandler",
  });

  // Google
  app.register(fastifyOauth2, {
    name: "googleOAuth",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID!,
        secret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/auth/google",
    callbackUri: `${process.env.BACKEND_URL}/auth/google/callback`,
  });

  // GitHub
  app.register(fastifyOauth2, {
    name: "githubOAuth",
    scope: ["user:email"],
    credentials: {
      client: {
        id: process.env.GITHUB_CLIENT_ID!,
        secret: process.env.GITHUB_CLIENT_SECRET!,
      },
      auth: fastifyOauth2.GITHUB_CONFIGURATION,
    },
    startRedirectPath: `/auth/github`,
    callbackUri: `${process.env.BACKEND_URL}/auth/github/callback`,
  });

  app.register(s.plugin(authController(app)), {
    responseValidation: true,
  });
};
