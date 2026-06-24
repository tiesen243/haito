import { ApiResponse } from '@/core/api-response'
import { createElysia } from '@/core/create-elysia'
// Modules
import { PostModule } from '@/modules/post/post.module'
// Plugins
import { contextPlugin } from '@/plugins/context.plugin'
import { corsPlugin } from '@/plugins/cors.plugin'
import { loggerPlugin } from '@/plugins/logger.plugin'

export class AppModule {
  private constructor(
    private readonly plugins = [contextPlugin, corsPlugin, loggerPlugin],
    private readonly modules = [PostModule]
  ) {}

  public static create(): Promise<ReturnType<typeof createElysia>> {
    const appModule = new AppModule()

    const app = createElysia({
      name: 'app',
    })

    for (const plugin of appModule.plugins) app.use(plugin)
    for (const module of appModule.modules) app.use(module.create())

    app.all('*', () =>
      ApiResponse.notFound('The requested resource was not found.')
    )

    return Promise.resolve(app.compile())
  }
}
