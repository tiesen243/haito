import * as Effect from 'effect/Effect'
import { Elysia } from 'elysia'

import pkgJson from '@/../package.json' with { type: 'json' }
import { env } from '@/shared/lib/env'

export const homeController = new Elysia({
  name: 'controller.home',
})
  .get('/', () =>
    Effect.succeed({
      name: pkgJson.name,
      version: pkgJson.version ?? '1.0.0',
    })
  )

  .get('/health', () =>
    Effect.succeed({
      status: 'healthy',
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100,
        unit: 'MB',
      },
      cpu: process.cpuUsage(),
    })
  )
