import { createEnv } from '@haito/lib/create-env'
import * as z from 'zod'

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },

  server: {},

  clientPrefix: 'VITE_',
  client: {
    VITE_API_URL: z.url().default('http://localhost:3000'),
    VITE_WEB_URL: z.url().default('http://localhost:5173'),
  },

  runtimeEnv: typeof window === 'undefined' ? process.env : import.meta.env,
})
