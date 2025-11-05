import pino from "pino";
import type { LogContext, LoggerNamespace } from "@mikro-orm/core";
import {
  Options,
  Platform,
  TextType,
  Type,
  Logger as MikroLogger,
} from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Migrator } from "@mikro-orm/migrations";
import { env } from "./src/env.validation";
import { NotFoundException } from "./src/exceptions/http.exception";

// Create a Pino logger instance
const pinoLogger = pino({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
});

// Create a custom logger that wraps Pino
class PinoMikroLogger implements MikroLogger {
  private logger = pinoLogger.child({ module: "mikro-orm" });

  /**
   * Logs a message with optional context
   */
  log(
    namespace: LoggerNamespace | string,
    message: string,
    context?: LogContext
  ): void {
    if (namespace === "query" && context && "query" in context) {
      this.logger.debug(
        {
          query: (context as any).query,
          params: (context as any).params,
          took: (context as any).took,
          results: (context as any).results,
        },
        `[query] ${message}`
      );
    } else {
      this.logger.debug(context || {}, `[${namespace}] ${message}`);
    }
  }

  /**
   * Logs a query
   */
  logQuery(context: { query: string }): void {
    this.logger.debug(`[query] ${context.query}`);
  }

  /**
   * Logs an error message
   */
  error(
    namespace: LoggerNamespace | string,
    message: string,
    context?: LogContext
  ): void {
    this.logger.error(context || {}, `[${namespace}] ${message}`);
  }

  /**
   * Logs a warning message
   */
  warn(
    namespace: LoggerNamespace | string,
    message: string,
    context?: LogContext
  ): void {
    this.logger.warn(context || {}, `[${namespace}] ${message}`);
  }

  /**
   * Sets the debug mode
   */
  setDebugMode(debug: boolean | string[]): void {
    this.logger.level = debug
      ? "debug"
      : env.NODE_ENV === "development"
      ? "debug"
      : "info";
  }

  /**
   * Checks if logging is enabled for the given namespace
   */
  isEnabled(namespace: LoggerNamespace | string): boolean {
    return this.logger.level === "debug";
  }
}

const config: Options = {
  driver: PostgreSqlDriver,
  clientUrl: env.DATABASE_URL,
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false, // For self-signed certificates, use with caution in production
      },
    },
  },
  discovery: {
    getMappedType(type: string, platform: Platform) {
      // override the mapping for string properties only
      if (type === "string") {
        return Type.getType(TextType);
      }
      return platform.getDefaultMappedType(type);
    },
  },
  // Configure logging
  debug:
    env.NODE_ENV === "development"
      ? ["query", "query-params", "schema"]
      : false,
  logger: (message: string) => {
    const logger = new PinoMikroLogger();
    logger.log("app", message);
  },
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    tableName: "mikro_orm_migrations", // name of database table with log of executed transactions
    path: ".migrations", // path to the folder with migrations
    pathTs: ".migrations", // path to the folder with TS migrations
    glob: "!(*.d).{js,ts}", // how to match migration files
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    emit: "ts", // migration generation mode
  },
  extensions: [Migrator],
  findOneOrFailHandler: (entityName) => {
    throw new NotFoundException(`${entityName} not found`);
  },
};

export default config;
