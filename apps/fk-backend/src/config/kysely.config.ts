import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { env } from '../env.validation';

// Create a type that represents any database schema
type AnyDB = Record<string, any>;

// Create a singleton instance of Kysely with any schema
let db: Kysely<AnyDB> | null = null;

/**
 * Get the Kysely database instance
 * @returns Kysely instance with any database schema
 */
export function getKysely(): Kysely<AnyDB> {
  if (!db) {
    if (!env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required in environment variables');
    }
    
    db = new Kysely<AnyDB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: env.DATABASE_URL,
          ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        }),
      }),
      log: (event) => {
        if (env.NODE_ENV === 'development') {
          if (event.level === 'query') {
            console.log(`[Kysely Query] ${event.query.sql}`);
            console.log(`[Kysely Params] ${event.query.parameters}`);
            console.log(`[Kysely Duration] ${event.queryDurationMillis}ms`);
          } else if (event.level === 'error') {
            console.error(`[Kysely Error]`, event.error);
          }
        }
      },
    });
  }
  
  return db;
}

/**
 * For testing and cleanup
 */
export async function closeKysely(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
  }
}

// Re-export Kysely types for convenience
export type { Selectable, Insertable, Updateable } from 'kysely';

// Example of how to define types for specific tables when needed
export type KyselyWithTables<Tables> = Kysely<{
  [K in keyof Tables]: Tables[K];
}>;

// Example usage in your code:
// type UserTable = {
//   id: number;
//   email: string;
//   // ... other fields
// };
//
// type AppDB = {
//   user: UserTable;
//   // ... other tables
// };
//
// // Then in your service/repository:
// const db = getKysely() as KyselyWithTables<AppDB>;
