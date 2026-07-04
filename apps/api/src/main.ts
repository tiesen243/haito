import { openapi } from '@elysia/openapi'
import { toJSONSchema } from 'zod'

import pkgJson from '@/../package.json' with { type: 'json' }
import { AppModule } from '@/app.module'
import { authController } from '@/presentation/http/auth.controller'
import { homeController } from '@/presentation/http/home.controller'
import { postController } from '@/presentation/http/post.controller'
import { cors } from '@/shared/plugins/cors'
import { errorHandle } from '@/shared/plugins/error-handle'

const app = AppModule.bootstrap({
  persistenceDriver: 'drizzle',
  oauthProviders: ['google'],
  jwt: {
    secret: process.env.JWT_SECRET ?? 'secret',
    algorithm: 'HS256',
  },
})
  // Plugins
  .use(cors)
  .use(errorHandle)
  .use(
    openapi({
      path: '/docs',
      documentation: {
        info: {
          title: `${pkgJson.name} Documentation`,
          version: pkgJson.version ?? '1.0.0',
        },
      },
      mapJsonSchema: {
        zod: toJSONSchema,
      },
    })
  )

  // Controllers
  .use(homeController)
  .use(authController)
  .use(postController)

  .compile()

export default {
  fetch: app.fetch,
}
