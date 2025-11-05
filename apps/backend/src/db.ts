import { MikroORM } from "@mikro-orm/postgresql"

export const orm = await MikroORM.init()

export const em = orm.em
