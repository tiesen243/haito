import { init, withElysia } from '@sentry/elysia'

import { createApp } from '@/app'

init({
  dsn: process.env.SENTRY_DSN,
  enableLogs: true,
  beforeSendLog: (log) => {
    if (process.env.NODE_ENV !== 'production')
      console.log(log.message, {
        requestId: (log.attributes as { requestId?: string }).requestId,
        userId: (log.attributes as { userId?: string }).userId,
        details: (log.attributes as { details?: unknown }).details,
      })
    return log
  },
})

const app = withElysia(await createApp())

export default {
  fetch: app.fetch,
}
