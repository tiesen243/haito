import { createEnv } from '@haito/lib/create-env'
import * as z from 'zod'

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },

  server: {
    PORT: z.number().default(3000),

    DATABASE_URL: z
      .string()
      .default('postgresql://postgres:secret@127.0.0.1:5432/db'),

    AUTH_SECRET: z.string().default('secret'),
  },

  clientPrefix: 'PUBLIC_',
  client: {},

  runtimeEnv: process.env,
})
