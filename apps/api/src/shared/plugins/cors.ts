import Elysia from 'elysia'

import { env } from '@/shared/lib/env'

export const cors = new Elysia({
  name: 'plugin.cors',
})
  .onRequest(({ request, set }) => {
    set.headers.vary = 'Origin'
    set.headers['access-control-allow-origin'] = env.CORS_ORIGIN

    set.headers['access-control-allow-methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    set.headers['access-control-allow-headers'] = 'Content-Type,Authorization'
    set.headers['access-control-expose-headers'] = 'Content-Type,Authorization'
    set.headers['access-control-allow-credentials'] = 'true'

    if (request.method === 'OPTIONS') return new Response(null, { status: 204 })
  })
  .as('scoped')
