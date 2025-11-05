import { MikroORM } from '@mikro-orm/postgresql';
import { databaseConfig } from './config/database.config';
import { getKysely } from './config/kysely.config';

// Global database instances
let orm: Awaited<ReturnType<typeof MikroORM.init>> | null = null;

/**
 * Initialize the database connection
 */
export async function initDatabase() {
  if (!orm) {
    orm = await MikroORM.init(databaseConfig);
    
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

// For backward compatibility
export const em = {
  get: () => {
    if (!orm) {
      throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return orm.em.fork();
  },
};

// Initialize database when this module is imported
if (process.env.NODE_ENV !== 'test') {
  initDatabase().catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
}

export { getKysely } from './config/kysely.config';
