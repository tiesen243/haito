import type { ElysiaContext } from '@/core/create-elysia'

import { createElysia } from '@/core/create-elysia'

export const contextPlugin = createElysia({
  name: 'plugin.context',
})
  .onBeforeHandle(({ store, request }) => {
    let session: ElysiaContext['session'] = null
    const requestId =
      request.headers.get('x-request-id') ??
      request.headers.get('cf-ray') ??
      crypto.randomUUID().split('-')[0] ??
      'unknown'
    const requestWith = request.headers.get('x-requested-with') ?? 'unknown'

    const authHeader =
      request.headers.get('authorization') ??
      request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.replace('Bearer ', '').trim()
      session = {
        userId: accessToken,
        role: 'user',
      }
    }

    store.context = { requestId, requestWith, session }
  })

  .as('global')
