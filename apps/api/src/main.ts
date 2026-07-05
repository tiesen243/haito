import { openapi } from '@elysia/openapi'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'

import pkgJson from '@/../package.json' with { type: 'json' }
import { bootstrap } from '@/bootstrap'
import { userController } from '@/presentation/http/user.controller'
import { errorHandle } from '@/shared/plugins/error-handle'

const server = bootstrap({
  name: pkgJson.name,
  aot: true,
  adapter: CloudflareAdapter,

  persistenceDriver: 'in-memory',
})
  // Register plugins
  .use(errorHandle)
  .use(
    openapi({
      path: '/docs',
      documentation: {
        info: { title: pkgJson.name, version: pkgJson.version },
      },
    })
  )

  // Register controllers
  .use(userController)

  .compile()

export default {
  fetch: server.fetch,
}
