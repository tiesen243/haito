import { Elysia } from 'elysia'

import { ApiResponse } from '@/shared/api-response'
import { env } from '@/shared/env'

export const homeController = new Elysia({
  name: 'controller.home',
})
  .get('/', () =>
    ApiResponse.ok('Welcome to the API', {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
    })
  )

  .get('/health', () =>
    ApiResponse.ok('Service is healthy', {
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
