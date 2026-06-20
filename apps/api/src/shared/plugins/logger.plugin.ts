import { logger } from '@sentry/elysia'

import { ApiResponse } from '@/shared/api-response'
import { createElysia } from '@/shared/create-elysia'

export const loggerPlugin = createElysia({
  name: 'plugin.logger',
})
  .onBeforeHandle(({ store, request, path, query, body }) => {
    const requestFrom = request.headers.get('x-client') ?? 'unknown'

    logger.info(`[${request.method}] ${path} from ${requestFrom}`, {
      requestId: store.context.requestId,
      userId: store.context.session?.userId ?? 'anonymous',
      details: { query, body },
    })
  })

  .error({ ApiResponse })
  .onError(({ path, store, code, error }) => {
    if (path === '/favicon.ico' || code === 'PARSE' || code === 'VALIDATION')
      return
    let status = typeof code === 'number' ? code : 500,
      // oxlint-disable-next-line sort-vars
      details = null,
      message = 'Internal Server Error'

    switch (code) {
      case 'ApiResponse':
        ;({ status, message } = error)
        details = error.error
        break
      case 'NOT_FOUND':
      case 'INTERNAL_SERVER_ERROR':
        if (code === 'NOT_FOUND') status = 404
        ;({ message } = error)
        details = error.stack
        break
      default:
        return
    }

    logger.error(`[${status}] ${message}`, {
      requestId: store.context.requestId,
      userId: store.context.session?.userId ?? 'anonymous',
      details,
    })
  })

  .as('global')
