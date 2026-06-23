import { createEnv } from '@haito/lib/create-env'
import { Config } from 'react-native-config'
import * as z from 'zod'

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },

  server: {},

  clientPrefix: 'PUBLIC_',
  client: {
    PUBLIC_API_URL: z.url().default('http://localhost:3000'),
    PUBLIC_WEB_URL: z.url().default('http://localhost:5173'),
  },

  runtimeEnv: Config,
})
