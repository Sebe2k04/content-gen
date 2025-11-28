import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

export default fp(async function jwtPlugin(app: FastifyInstance) {
  app.register(import("@fastify/jwt"), {
    secret: process.env.JWT_SECRET!,
  });

  app.decorate(
    "authenticate",
    async function (request: any, reply: any) {
      try {
        const token = request.headers.authorization?.split(" ")[1];
        if (!token) {
          return reply.status(401).send({ message: "Unauthorized" });
        }

        const decoded = app.jwt.verify(token);
        request.user = decoded; // attaches user to request
        return;
      } catch (err) {
        return reply.status(401).send({ message: "Invalid token" });
      }
    }
  );
});
