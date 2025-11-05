import Fastify from "fastify";
import { initServer } from "@ts-rest/fastify";
import { authContract } from "contract";

const app = Fastify();
const s = initServer();

const router = s.router(authContract, {
  test: async (req) => {
    return {
      status: 200 as const,
      body: { message: "Auth test route works!" },
    };
  },
});

app.register(s.plugin(router), {
  responseValidation: true,
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
