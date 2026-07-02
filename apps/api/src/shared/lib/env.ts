import { createEnv } from '@haito/lib/create-env'
import * as z from 'zod'

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },

  server: {
    API_URL: z.string().default('http://localhost:3000'),

    POSTGRES_HOST: z.string().default('127.0.0.1'),
    POSTGRES_PORT: z.coerce.number().default(5432),
    POSTGRES_USER: z.string().default('postgres'),
    POSTGRES_PASSWORD: z.string().default('secret'),
    POSTGRES_DB: z.string().default('db'),

    CORS_ORIGIN: z.string().default('http://localhost:5173'),

    AUTH_SECRET: z.string().default('secret'),

    AUTH_GOOGLE_ID: z.string().default(''),
    AUTH_GOOGLE_SECRET: z.string().default(''),

    AUTH_GITHUB_ID: z.string().default(''),
    AUTH_GITHUB_SECRET: z.string().default(''),
  },

  clientPrefix: 'PUBLIC_',
  client: {},

  runtimeEnv: process.env,
})
