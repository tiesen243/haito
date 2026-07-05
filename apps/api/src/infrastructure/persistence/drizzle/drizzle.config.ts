import { defineConfig } from 'drizzle-kit'
import path from 'node:path'

import { env } from '@/shared/env'

const pwd = path.resolve(
  process.cwd(),
  'src/infrastructure/persistence/drizzle'
)

export default defineConfig({
  dialect: 'postgresql',
  schema: path.join(pwd, 'drizzle.schema.ts'),
  out: path.join(pwd, 'migrations'),
  dbCredentials: { url: env.DATABASE_URL },
})
