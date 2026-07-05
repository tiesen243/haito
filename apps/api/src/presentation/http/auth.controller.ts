import { Effect } from 'effect'
import { Elysia } from 'elysia'

import { OAuthService } from '@/application/services/oauth.service'
import { AuthCookie, OAuthQuery } from '@/application/types/auth.type'
import {
  getCurrentUserUseCase,
  getOrCreateAccountUseCase,
} from '@/application/use-cases/auth.use-case'
import { Config } from '@/shared/config'
import { HttpError } from '@/shared/http-error'

export const authController = new Elysia({
  name: 'controller.auth',
  prefix: '/api/auth',
  tags: ['auth'],
})
  .get(
    '/whoami',
    ({ cookie }) =>
      getCurrentUserUseCase({ accessToken: cookie['auth.access_token'].value }),
    { cookie: AuthCookie }
  )

  .get(
    '/:provider',
    ({ params, query: { redirect_uri }, cookie }) =>
      Effect.gen(function* authControllerGet() {
        const { url, state, code } = yield* OAuthService.setup(params.provider)
        const {
          auth: { cookieOptions },
        } = yield* Config

        cookie['auth.state'].set({ ...cookieOptions, value: state })
        cookie['auth.code'].set({ ...cookieOptions, value: code })
        cookie['auth.redirect_uri'].set({
          ...cookieOptions,
          value: redirect_uri,
        })

        return yield* HttpError.redirect(url.toString())
      }),

    { query: OAuthQuery, cookie: AuthCookie }
  )

  .get(
    '/:provider/callback',
    ({ request, params, query, cookie }) =>
      Effect.gen(function* authControllerGet() {
        const {
          auth: { cookieOptions, session },
        } = yield* Config

        const { state, code } = query
        const storedState = cookie['auth.state'].value
        const storedCode = cookie['auth.code'].value
        const redirectUrl = new URL(
          cookie['auth.redirect_uri'].value ?? '/',
          request.url
        )

        if (
          !state ||
          !storedState ||
          !code ||
          !storedCode ||
          state !== storedState
        )
          return yield* HttpError.badRequest('Invalid state parameter')

        const user = yield* OAuthService.validate(
          params.provider,
          code,
          storedCode
        )

        const { accessToken, refreshToken, expiresAt } =
          yield* getOrCreateAccountUseCase({
            ...user,
            provider: params.provider,
          })

        cookie['auth.state'].remove()
        cookie['auth.code'].remove()
        cookie['auth.redirect_uri'].remove()

        cookie['auth.access_token'].set({
          ...cookieOptions,
          value: accessToken,
          maxAge: session?.accessTokenExpiresIn,
        })
        cookie['auth.refresh_token'].set({
          ...cookieOptions,
          value: refreshToken,
          expires: expiresAt,
        })

        redirectUrl.searchParams.set('access_token', accessToken)
        redirectUrl.searchParams.set('refresh_token', refreshToken)
        return yield* HttpError.redirect(redirectUrl.toString())
      }),
    { query: OAuthQuery, cookie: AuthCookie }
  )
