import Elysia from 'elysia'

import { ApiResponse } from '@/shared/api-response'

export const errorHandle = new Elysia({
  name: 'plugin.error-handle',
})
  .onError(({ path, error, code }) => {
    if (path === '/favicon.ico') return

    switch (code) {
      case 'NOT_FOUND':
        return ApiResponse.notFound('The requested resource was not found')
      case 'VALIDATION':
        return ApiResponse.badRequest('Validation error', error.all)
      case 'UNKNOWN':
        return new ApiResponse({
          status: typeof code === 'number' ? code : 500,
          message: error.message,
        })
      default:
        return ApiResponse.internalServerError('Unknown error', error)
    }
  })
  .as('scoped')
