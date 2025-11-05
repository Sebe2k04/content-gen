import 'dotenv/config'

if (!process.env.DB_NAME) throw new Error("DB_NAME missing")

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
}
