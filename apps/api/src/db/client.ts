import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { env } from '../config/env.js'
import type { Database } from './database.types.js'

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
  }),
})

export const db = new Kysely<Database>({ dialect })
