import Fastify, { FastifyInstance } from "fastify";
import { generateOpenApi } from "@ts-rest/open-api";
import { authModule } from "./auth/auth.module.js";
import { env } from "./env.validation.js";
import { contract } from "contract";
import { httpExceptionHandler } from "./common/filters/http-exception.filter.ts";
import { initDatabase, closeDatabase, getEntityManager } from "./db.js";

const openApiSpec = generateOpenApi(contract, {
  info: {
    title: "Content Generation API",
    version: "1.0.0",
  },
});
export const createServer = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
      serializers: {
        req: (request) => ({
          method: request.method,
          url: request.url,
          hostname: request.hostname,
          remoteAddress: request.ip,
          remotePort: request.socket.remotePort,
        }),
        res: (reply) => ({
          statusCode: reply.statusCode,
        }),
      },
    },
    disableRequestLogging: process.env.NODE_ENV === "test",
  });
  app.addHook("onRequest", (request, _reply, done) => {
    request.id = crypto.randomUUID();
    request.log = request.log.child({ requestId: request.id });
    done();
  });
  app.addHook("onResponse", (request, reply, done) => {
    request.log.info(
      {
        res: reply,
        responseTime: reply.getResponseTime(),
      },
      "Request completed"
    );
    done();
  });
  // Initialize database
  try {
    await initDatabase();
    app.log.info('Database connected successfully');
  } catch (error) {
    app.log.error(error, 'Failed to connect to database');
    throw error;
  }

  // Add database instance to Fastify instance for easy access in routes
  app.decorate('db', {
    em: getEntityManager(),
    // Add Kysely instance if needed
    // kysely: getKysely()
  });

  // Register auth module
  app.register(authModule);
  app.get("/openapi.json", async () => openApiSpec);
  await app.register(import("@scalar/fastify-api-reference"), {
    routePrefix: "/docs",
    configuration: {
      title: "Our API Reference",
      url: "/openapi.json",
    },
  });
  app.get("/", (_req, reply) => {
    reply.redirect("/docs");
  });
  app.get("/health", async (request) => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  });
  app.setErrorHandler(httpExceptionHandler);

  // Add hook to close database connection when server shuts down
  app.addHook('onClose', async () => {
    await closeDatabase();
  });

  return app;
};
const start = async () => {
  const app = await createServer();
  const logger = app.log;

  try {
    logger.info("Starting server...");
    const address = await app.listen({
      port: env.PORT,
    });
    logger.info(`Server running at ${address}`);
    logger.info("Docs available → /docs/");
  } catch (error) {
    logger.fatal({ error }, "Failed to start server");
    process.exit(1);
  }
};
if (require.main === module) {
  start();
}

export { start };
