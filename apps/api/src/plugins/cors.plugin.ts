import { createElysia } from '@/core/create-elysia'
import { env } from '@/core/env'

export const corsPlugin = createElysia({
  name: 'plugin.cors',
}).onRequest(({ request, set }) => {
  const origin = env.CORS_ORIGIN ?? '*'
  const requestOrigin = request.headers.get('Origin')

  set.headers['access-control-allow-origin'] =
    origin === '*' ? (requestOrigin ?? '*') : origin
  set.headers.vary = 'Origin'

  set.headers['access-control-allow-methods'] =
    'GET, POST, PUT, DELETE, OPTIONS'

  set.headers['access-control-allow-headers'] =
    'Content-Type, Authorization, X-Requested-With'
  set.headers['access-control-expose-headers'] = 'Content-Type'

  set.headers['access-control-allow-credentials'] =
    origin === '*' ? 'false' : 'true'

  if (request.method === 'OPTIONS') {
    set.headers['access-control-max-age'] = '86400'
    return new Response(null, { status: 204 })
  }
})
