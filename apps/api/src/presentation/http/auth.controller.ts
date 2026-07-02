import { Effect } from 'effect'
import { Elysia, t } from 'elysia'

import { OAuthService } from '@/application/services/oauth.service'
import { generateStateOrCode } from '@/infrastructure/oauth/lib/crypto'
import { HttpError } from '@/shared/http-error'
import { env } from '@/shared/lib/env'

const cookieOptions = {
  path: '/',
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
}

const cookieSchema = t.Object({
  'auth.state': t.Optional(t.String({ default: '' })),
  'auth.code': t.Optional(t.String({ default: '' })),
  'auth.redirect_uri': t.Optional(t.String({ default: '/' })),
})

export const authController = new Elysia({
  name: 'controller.auth',
  prefix: '/api/auth',
  tags: ['auth'],
})
  .get(
    '/:provider',
    ({ params, query, cookie }) =>
      Effect.gen(function* authControllerGet() {
        const provider = yield* OAuthService.forProvider(params.provider)

        const state = generateStateOrCode()
        const code = generateStateOrCode()

        const url = yield* provider.createAuthorizationUrl(state, code)

        cookie['auth.state'].set({
          ...cookieOptions,
          value: state,
          maxAge: 300,
        })
        cookie['auth.code'].set({ ...cookieOptions, value: code, maxAge: 300 })
        cookie['auth.redirect_uri'].set({
          ...cookieOptions,
          value: query.redirect_uri,
          maxAge: 300,
        })

        return yield* HttpError.redirect(url.toString())
      }),

    {
      query: t.Object({ redirect_uri: t.String({ default: '/' }) }),
      cookie: cookieSchema,
    }
  )
  .get(
    '/:provider/callback',
    ({ params, query, cookie }) =>
      Effect.gen(function* authControllerGet() {
        const provider = yield* OAuthService.forProvider(params.provider)

        const { state, code } = query
        const storedState = cookie['auth.state'].value
        const storedCode = cookie['auth.code'].value
        const _redirectUri = cookie['auth.redirect_uri'].value ?? '/'

        if (!state || !storedState || !storedCode || state !== storedState)
          return yield* HttpError.badRequest('Invalid state parameter')

        const data = yield* provider.fetchUserData(code, storedCode)

        cookie['auth.state'].remove()
        cookie['auth.code'].remove()
        cookie['auth.redirect_uri'].remove()

        return data
      }),
    {
      query: t.Object({ code: t.String(), state: t.String() }),
      cookie: cookieSchema,
    }
  )
