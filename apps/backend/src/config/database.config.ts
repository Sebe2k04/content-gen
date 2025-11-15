import { MikroORM, type Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Migrator } from "@mikro-orm/migrations";
import {
  EntityManager,
  type IDatabaseDriver,
  type Connection,
} from "@mikro-orm/core";
import { env } from "../env.validation";

// Import all entities
import { User } from "../entities/user.entity";

// Define the database configuration type
type DatabaseConfig = Options & {
  // Add any custom configuration options here
  // For example:
  // customOption?: string;
  driver: typeof PostgreSqlDriver;
};

export const databaseConfig: DatabaseConfig = {
  // Database driver
  driver: PostgreSqlDriver,

  // Use DATABASE_URL for connection with SSL
  clientUrl:
    env.DATABASE_URL +
    (env.DATABASE_URL.includes("?") ? "&" : "?") +
    "sslmode=require",

  // Enable debug mode in development
  debug: env.NODE_ENV === "development",

  // SSL configuration
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false, // For self-signed certificates, set to false in development
      },
    },
  },

  // Register all entities
  entities: ["dist/backend/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],

  // Auto-generate database schema (only in development)
  // In production, use migrations
  schemaGenerator: {
    // Don't drop tables in production
    createForeignKeyConstraints: true,
    disableForeignKeys: false,
  },

  // Configure migrations
  migrations: {
    tableName: "mikro_orm_migrations", // name of database table with log of executed transactions
    path: "./dist/migrations", // path to the folder with migrations
    pathTs: "./src/migrations", // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
    glob: "!(*.d).{js,ts}", // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: "ts" as const, // migration generation mode
  },

  // Use TypeScript decorators for metadata
  metadataProvider: TsMorphMetadataProvider,

  // Extensions
  extensions: [Migrator],

  // Connection pool options
  pool: {
    min: 2,
    max: 10,
  },

  // Logger
  logger: (message: string) => {
    if (env.NODE_ENV === "development") {
      console.log(`[MikroORM] ${message}`);
    }
  },
};

export type Database = Awaited<ReturnType<typeof MikroORM.init>>;

export type DatabaseContext = {
  orm: Database;
  em: EntityManager;
};

// Initialize the database connection
export async function initDatabase(connect = true): Promise<Database> {
  const orm = await MikroORM.init({
    ...databaseConfig,
    connect,
  });

  if (connect) {
    if (env.NODE_ENV === "production") {
      const migrator = orm.getMigrator();
      await migrator.up();
    } else {
      const generator = orm.getSchemaGenerator();
      await generator.updateSchema();
    }
  }

  return orm;
}

// Helper function to get the entity manager
export function getEntityManager(): EntityManager {
  const orm = global as any;
  if (!orm.__MIKRO_ORM__) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return orm.__MIKRO_ORM__.em.fork();
}
