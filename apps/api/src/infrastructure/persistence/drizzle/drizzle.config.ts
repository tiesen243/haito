import { defineConfig } from 'drizzle-kit'
import path from 'node:path'

import { env } from '@/shared/env'

const drizzleDir = path.join(
  process.cwd(),
  'src/infrastructure/persistence/drizzle'
)

export default defineConfig({
  schema: path.join(drizzleDir, 'drizzle.schema.ts'),
  out: path.join(drizzleDir, 'migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  },
  casing: 'snake_case',
})
