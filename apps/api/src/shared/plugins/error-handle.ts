import Elysia from 'elysia'

import { HttpError } from '@/shared/http-error'

export const errorHandle = new Elysia({
  name: 'shared/plugins/error-handle',
})

  .onError(({ path, code, error }) => {
    if (!path.startsWith('/api')) return

    switch (code) {
      case 'NOT_FOUND':
        return HttpError.notFound('The requested resource was not found')
      case 'VALIDATION':
        return HttpError.badRequest('Validation failed', error.all)
      default:
        console.error('Unexpected error:', error)
        return HttpError.internalServerError(
          'An unexpected error occurred',
          error
        )
    }
  })

  .as('scoped')
