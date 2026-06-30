import { openapi } from '@elysia/openapi'

import { AppModule } from '@/app.module'
import { homeController } from '@/presentation/http/home.controller'
import { postController } from '@/presentation/http/post.controller'
import { cors } from '@/shared/plugins/cors'
import { errorHandle } from '@/shared/plugins/error-handle'

const app = AppModule.create({
  persistenceDriver: 'drizzle',
})
  .use(cors)
  .use(errorHandle)
  .use(openapi())

  .use(homeController)
  .use(postController)

  .compile()

export default {
  fetch: app.fetch,
}
