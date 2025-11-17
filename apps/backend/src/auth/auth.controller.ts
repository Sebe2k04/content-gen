import { initServer } from "@ts-rest/fastify";
import { contract } from "contract";
import { getAuthService } from "./auth.service";
import { FastifyInstance } from "fastify";

const s = initServer();

export const authController = (app: FastifyInstance) =>
  s.router(contract.auth, {
    signup: async ({ body }) => {
      const authService = await getAuthService();
      const output = await authService.signup(body);
      return { status: 201, body: output };
    },

    login: async ({ body }) => {
      const authService = await getAuthService();
      const output = await authService.login(body);
      return { status: 200, body: output };
    },

    generateEmailOtp: async ({ body }) => {
      const authService = await getAuthService();
      await authService.generateEmailOtp(body.email);
      return { status: 200, body: { message: "OTP sent" } };
    },

    verifyEmailOtp: async ({ body }) => {
      const authService = await getAuthService();
      const output = await authService.verifyEmailOtp(body.email, body.otp);
      return { status: 200, body: output };
    },
    // googleLogin: async ({ request, reply }) => {
    //   const authUrl = await app.googleOAuth.generateAuthorizationUri(
    //     request,
    //     reply
    //   );
    //   return reply.redirect(302, authUrl);
    // },

    googleCallback: async ({ request, reply }) => {
      const authService = await getAuthService();
      const { token } =
        await app.googleOAuth.getAccessTokenFromAuthorizationCodeFlow(request);
      const redirectUrl = await authService.handleGoogleCallback(
        token.access_token
      );
      return reply.redirect(302, redirectUrl);
    },

    // githubLogin: async ({ request, reply }) => {
    //   try {
    //     const authUrl = app.githubOAuth.generateAuthorizationUri({
    //       redirect_uri: `${process.env.BACKEND_URL}/api/auth/github/callback`,
    //       state: request.session.get("state") || "random-state",
    //     });
    //     return reply.redirect(authUrl);
    //   } catch (error) {
    //     console.error("GitHub OAuth error:", error);
    //     return reply
    //       .status(500)
    //       .send({ error: "Failed to initialize GitHub OAuth" });
    //   }
    // },

    githubCallback: async ({ request, reply }) => {
      const authService = await getAuthService();
      const { token } =
        await app.githubOAuth.getAccessTokenFromAuthorizationCodeFlow(request);
      const redirectUrl = await authService.handleGithubCallback(
        token.access_token
      );
      return reply.redirect(302, redirectUrl);
    },
  });
