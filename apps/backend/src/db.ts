import { MikroORM, type EntityManager, type IDatabaseDriver, type Connection, type Configuration } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import type { Options } from '@mikro-orm/core';
import type { PostgreSqlDriver as PgDriver } from '@mikro-orm/postgresql';
import config from "../mikro-orm.config";
import { getKysely } from './config/kysely.config';

type OrmType = MikroORM<PostgreSqlDriver>;

// Global database instances
let orm: OrmType | null = null;

/**
 * Initialize the database connection
 */
export async function initDatabase(): Promise<OrmType> {
  if (!orm) {
    orm = await MikroORM.init<PostgreSqlDriver>(config as Options<PostgreSqlDriver>);
    
    // Store the EntityManager in the global scope for easier access
    (global as any).__MIKRO_ORM__ = { em: orm.em };
    
    // Initialize Kysely
    getKysely();
    
    if (process.env.NODE_ENV !== 'test') {
      console.log('Database connection established');
    }
  }
  
  return orm;
}

/**
 * Get the MikroORM EntityManager
 * @returns EntityManager instance
 */
export function getEntityManager() {
  if (!orm) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return orm.em.fork();
}

/**
 * Close the database connection
 */
export async function closeDatabase() {
  if (orm) {
    await orm.close();
    orm = null;
  }
}

// Store the initialization promise to prevent multiple initializations
let initPromise: Promise<OrmType> | null = null;

// Function to ensure database is initialized
export async function ensureDbInitialized(): Promise<OrmType> {
  if (orm) return orm;
  if (!initPromise) {
    initPromise = initDatabase().catch(err => {
      // Reset initPromise on error to allow retries
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

// For backward compatibility
export const em = {
  get: async (): Promise<EntityManager> => {
    const ormInstance = await ensureDbInitialized();
    return ormInstance.em.fork();
  },
  getSync: (): EntityManager => {
    if (!orm) {
      throw new Error('Database not initialized. Call ensureDbInitialized() first.');
    }
    return orm.em.fork();
  }
};

// Initialize database when this module is imported (for backward compatibility)
if (process.env.NODE_ENV !== 'test') {
  ensureDbInitialized().catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
}

export { getKysely } from './config/kysely.config';
