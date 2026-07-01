import { openapi } from '@elysia/openapi'
import { toJSONSchema } from 'zod'

import pkgJson from '@/../package.json' with { type: 'json' }
import { AppModule } from '@/app.module'
import { homeController } from '@/presentation/http/home.controller'
import { postController } from '@/presentation/http/post.controller'
import { cors } from '@/shared/plugins/cors'
import { errorHandle } from '@/shared/plugins/error-handle'

const app = AppModule.create({
  persistenceDriver: 'in-memory',
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
  .use(postController)

  .compile()

export default {
  fetch: app.fetch,
}
