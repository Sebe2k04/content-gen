import Fastify, { FastifyInstance } from "fastify";
import { initServer } from "@ts-rest/fastify";
import { generateOpenApi } from "@ts-rest/open-api";
import fastifySwagger from "@fastify/swagger";
import { authModule } from "./auth/auth.module";
import { env } from "./env.validation";
import { contract } from "contract";

const document = generateOpenApi(
  contract,
  {
    info: {
      title: "Content Generation API",
      description: "API for content generation service",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  {
    setOperationId: true,
    jsonQuery: true,
  }
);

// Convert to plain object to avoid type issues
const openApiDocument = JSON.parse(JSON.stringify(document));

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

  // Register Swagger with explicit configuration
  await app.register(fastifySwagger, {
    openapi: {
      ...openApiDocument,
      // Ensure we have the correct URL for the documentation
      servers: [{ url: 'http://localhost:3000' }]
    },
    hideUntagged: false,
    exposeRoute: true
  });

  // Register routes
  app.register(authModule);

  // Add a redirect from / to /documentation
  app.get("/", async (request, reply) => {
    reply.redirect("/documentation");
  });

  // Health check endpoint with logging
  app.get("/health", async (request) => {
    request.log.debug("Health check called");
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  });

  return app;
};

const start = async () => {
  const app = await createServer();
  const s = initServer();
  const logger = app.log;

  try {
    logger.info("Starting server...");
    logger.debug("Environment variables loaded");

    const address = await app.listen({
      port: env.PORT,
    });

    logger.info(`Server is running at ${address}`);
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);

    // Handle graceful shutdown
    const signals = ["SIGINT", "SIGTERM"] as const;
    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info({ signal }, "Shutting down server...");
        try {
          await app.close();
          logger.info("Server has been shut down");
          process.exit(0);
        } catch (error) {
          logger.error({ error }, "Error during shutdown");
          process.exit(1);
        }
      });
    });

    return app;
  } catch (error) {
    logger.fatal({ error }, "Failed to start server");
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  start().catch((error) => {
    console.error("Fatal error during application startup:", error);
    process.exit(1);
  });
}

export { start };
