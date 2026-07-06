import { openapi } from '@elysia/openapi'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'

import pkgJson from '@/../package.json' with { type: 'json' }
import { bootstrap } from '@/bootstrap'
import { Google } from '@/infrastructure/oauth/providers/google'
import { authController } from '@/presentation/http/auth.controller'
import { env } from '@/shared/env'
import { cors } from '@/shared/plugins/cors'
import { errorHandle } from '@/shared/plugins/error-handle'

const server = bootstrap({
  name: pkgJson.name,
  aot: true,
  adapter: CloudflareAdapter,
  cookie: {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    secrets: env.AUTH_SECRET,
  },

  persistenceDriver: 'in-memory',
  providers: [new Google(env.AUTH_GOOGLE_ID, env.AUTH_GOOGLE_SECRET)],
})
  // Register plugins
  .use(cors)
  .use(errorHandle)
  .use(
    openapi({
      path: '/docs',
      documentation: {
        info: { title: pkgJson.name, version: pkgJson.version },
        components: {
          securitySchemes: {
            BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          },
        },
      },
    })
  )

  // Register controllers
  .get('/', () => `${pkgJson.name} v${pkgJson.version}`)
  .use(authController)

  .compile()

export default {
  fetch: server.fetch,
}
