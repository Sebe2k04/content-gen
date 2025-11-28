import { defineConfig } from '@mikro-orm/postgresql'

export default defineConfig({
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  debug: true,
})
