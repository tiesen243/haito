import { init, withElysia } from '@sentry/elysia'

import { AppModule } from '@/app.module'
import { env } from '@/core/env'

init({
  dsn: env.SENTRY_DSN,
  enableLogs: true,
  beforeSendLog: (log) => {
    if (env.NODE_ENV === 'development')
      console.log(log.message, {
        requestId: (log.attributes as { requestId?: string }).requestId,
        userId: (log.attributes as { userId?: string }).userId,
        details: (log.attributes as { details?: unknown }).details,
      })
    return log
  },
})

const app = withElysia(await AppModule.create())
export default {
  fetch: app.fetch,
}
