import { logger } from '@sentry/elysia'

import { ApiResponse } from '@/core/api-response'
import { createElysia } from '@/core/create-elysia'

const IGNORED_PATHS = new Set(['/favicon.ico', '/openapi', '/openapi/json'])

export const loggerPlugin = createElysia({
  name: 'plugin.logger',
})
  .onBeforeHandle(({ store, request, path, query, body }) => {
    if (IGNORED_PATHS.has(path)) return

    const requestFrom = request.headers.get('X-Requested-With') ?? 'unknown'
    logger.info(`[${request.method}] ${path} from ${requestFrom}`, {
      requestId: store.context.requestId,
      userId: store.context.session?.userId ?? 'anonymous',
      details: { query, body },
    })
  })

  .error({ ApiResponse })
  .onError(({ path, store, code, error }) => {
    if (IGNORED_PATHS.has(path) || code === 'PARSE') return

    if (code === 'VALIDATION') {
      const details = error.detail(error.message)
      if (typeof details === 'string') return

      return new ApiResponse(422, 'Validation Error', null, details.errors)
    }

    let status = typeof code === 'number' ? code : 500,
      // oxlint-disable-next-line sort-vars
      details = null,
      message = 'Internal Server Error'

    switch (code) {
      case 'ApiResponse':
        ;({ status, message } = error)
        details = error.error
        break
      case 'UNKNOWN':
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
