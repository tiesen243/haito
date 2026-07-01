import Elysia from 'elysia'

import { HttpError } from '@/shared/http-error'

export const errorHandle = new Elysia({
  name: 'plugin.error-handle',
})
  .onError(({ path, error, code }) => {
    if (path === '/favicon.ico') return

    switch (code) {
      case 'NOT_FOUND':
        return HttpError.notFound('The requested resource was not found')
      case 'VALIDATION':
        return HttpError.badRequest('Validation error', error.all)
      case 'UNKNOWN':
        return new HttpError({
          status: typeof code === 'number' ? code : 500,
          message: error.message,
        })
      default:
        return HttpError.internalServerError('Unknown error', error)
    }
  })
  .as('scoped')
