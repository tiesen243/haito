import { openapi } from '@elysia/openapi'
import { toJSONSchema } from 'zod'

import pkgJson from '@/../package.json' with { type: 'json' }
import { bootstrap } from '@/bootstrap'
import { GithubProvider } from '@/infrastructure/oauth/providers/github.provider'
import { GoogleProvider } from '@/infrastructure/oauth/providers/google.provider'
import { authController } from '@/presentation/http/auth.controller'
import { homeController } from '@/presentation/http/home.controller'
import { postController } from '@/presentation/http/post.controller'
import { env } from '@/shared/lib/env'
import { cors } from '@/shared/plugins/cors'
import { errorHandle } from '@/shared/plugins/error-handle'

const app = bootstrap({
  persistenceDriver: 'drizzle',
  auth: {
    secret: env.AUTH_SECRET,
    providers: [
      new GoogleProvider(env.AUTH_GOOGLE_ID, env.AUTH_GOOGLE_SECRET),
      new GithubProvider(env.AUTH_GITHUB_ID, env.AUTH_GITHUB_SECRET),
    ],
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
      mapJsonSchema: { zod: toJSONSchema },
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
