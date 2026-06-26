import { openapi } from '@elysia/openapi'
import { toJSONSchema } from 'zod'

import pkgJson from '@/../package.json'
import { ApiResponse } from '@/core/api-response'
import { createElysia } from '@/core/create-elysia'
import { PostInfrastructure } from '@/modules/post/infrastructure/post.infrastructure'
import { PostModule } from '@/modules/post/post.module'
import { contextPlugin } from '@/plugins/context.plugin'
import { corsPlugin } from '@/plugins/cors.plugin'
import { loggerPlugin } from '@/plugins/logger.plugin'

// oxlint-disable-next-line unicorn/no-static-only-class typescript/no-extraneous-class
export class AppModule {
  static register(config: AppModule.Config) {
    const postModule = PostModule.withInfrasctructure(
      PostInfrastructure.use(config.persistanceDriver)
    )

    return createElysia()
      .use(corsPlugin)
      .use(contextPlugin)
      .use(loggerPlugin)
      .use(
        openapi({
          documentation: {
            info: { title: pkgJson.name, version: pkgJson.version },
          },
          mapJsonSchema: { zod: toJSONSchema },
        })
      )

      .use(postModule.register())
      .get('/', () =>
        ApiResponse.ok(`Welcome to ${pkgJson.name}`, {
          version: pkgJson.version,
        })
      )
      .get('/health', () =>
        ApiResponse.ok('OK', {
          status: 'healthy',
          cpu: process.cpuUsage(),
          memory: process.memoryUsage(),
          uptime: process.uptime(),
        })
      )
      .all('*', () =>
        ApiResponse.notFound('The requested resource was not found')
      )
  }
}

export namespace AppModule {
  export interface Config {
    persistanceDriver: 'memory' | 'drizzle'
  }
}
