import { Effect } from 'effect'
import { Elysia } from 'elysia'

import { JWT } from '@/application/services/jwt.service'
import { OAuthService } from '@/application/services/oauth.service'
import { AuthCookie, OAuthQuery } from '@/application/types/auth.type'
import { getOrCreateAccountUseCase } from '@/application/use-cases/auth.use-case'
import { UserRepository } from '@/domain/repositories/user.repository'
import { HttpError } from '@/shared/http-error'

export const authController = new Elysia({
  name: 'controller.auth',
  prefix: '/api/auth',
  tags: ['auth'],
})
  .get(
    '/whoami',
    ({ cookie }) =>
      Effect.gen(function* authControllerGet() {
        const userRepo = yield* UserRepository
        const jwt = yield* JWT

        const accessToken = cookie['auth.access_token'].value
        if (!accessToken)
          return yield* HttpError.unauthorized('No access token found')

        const data = yield* jwt.verify(accessToken)
        const user = yield* userRepo.findBy({ id: data.sub })

        return user
      }),
    { cookie: AuthCookie }
  )

  .get(
    '/:provider',
    ({ params, query, cookie }) =>
      Effect.gen(function* authControllerGet() {
        const { url, state, code } = yield* OAuthService.setup(params.provider)

        cookie['auth.state'].set({
          ...OAuthService.cookieOptions,
          value: state,
          maxAge: 300,
        })
        cookie['auth.code'].set({
          ...OAuthService.cookieOptions,
          value: code,
          maxAge: 300,
        })
        cookie['auth.redirect_uri'].set({
          ...OAuthService.cookieOptions,
          value: query.redirect_uri,
          maxAge: 300,
        })

        return yield* HttpError.redirect(url.toString())
      }),

    { query: OAuthQuery, cookie: AuthCookie }
  )

  .get(
    '/:provider/callback',
    ({ request, params, query, cookie }) =>
      Effect.gen(function* authControllerGet() {
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
          ...OAuthService.cookieOptions,
          value: accessToken,
          maxAge: 1000 * 60 * 15, // 15 minutes
        })
        cookie['auth.refresh_token'].set({
          ...OAuthService.cookieOptions,
          value: refreshToken,
          expires: expiresAt,
        })

        redirectUrl.searchParams.set('access_token', accessToken)
        redirectUrl.searchParams.set('refresh_token', refreshToken)
        return yield* HttpError.redirect(redirectUrl.toString())
      }),
    { query: OAuthQuery, cookie: AuthCookie }
  )
