import type { ElysiaConfig } from 'elysia'

import { Elysia } from 'elysia'

export interface ElysiaContext {
  requestId: string
  session: {
    userId: string
    role: string
  } | null
}

export const createElysia = <TPrefix extends string>(
  options: ElysiaConfig<TPrefix>
) =>
  new Elysia({
    ...options,
    name: `root.${options.name ?? 'elysia'}`,
  })

    .state('context', {
      requestId: '',
      requestFrom: '',
      session: null,
    } as ElysiaContext)

    .onBeforeHandle(({ store, request }) => {
      let session: ElysiaContext['session'] = null
      const requestId =
        request.headers.get('x-request-id') ??
        request.headers.get('cf-ray') ??
        crypto.randomUUID().split('-')[0] ??
        'unknown'

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

      store.context = { requestId, session }
    })
