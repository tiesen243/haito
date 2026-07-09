import * as Effect from 'effect/Effect'
import { Elysia } from 'elysia'

import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
} from '@/application/dto/auth.dto'
import { AuthSchema } from '@/application/types'
import { AuthUseCase } from '@/application/use-case/auth.use-case'
import { InfrastructureOAuthModule } from '@/infrastructure/oauth/oauth.module'
import { authMiddleware } from '@/presentation/middleware/auth.middleware'
import { HttpError } from '@/shared/http-error'
import { generateStateOrCode } from '@/shared/lib/crypto'

export const authController = new Elysia({
  name: 'presentation/http/auth.controller',
  prefix: '/api/auth',
  tags: ['auth'],
})

  .group('', (app) =>
    app
      .use(authMiddleware)
      .get('/whoami', () => AuthUseCase.whoami())
      .post(
        '/logout',
        ({ cookie }) =>
          AuthUseCase.logout({
            refreshToken: cookie['auth.refresh_token'].value ?? '',
          }).pipe(
            Effect.tap(() => {
              cookie['auth.access_token'].remove()
              cookie['auth.refresh_token'].remove()
            })
          ),
        AuthSchema
      )
      .post(
        '/change-password',
        ({ body }) => AuthUseCase.changePassword(body),
        { body: ChangePasswordDto.input }
      )
  )

  .post(
    '/login',
    ({ body, cookie }) =>
      AuthUseCase.login(body).pipe(
        Effect.tap(({ accessToken, refreshToken, expiresAt: expires }) => {
          cookie['auth.access_token'].set({ value: accessToken })
          cookie['auth.refresh_token'].set({ value: refreshToken, expires })
        })
      ),
    {
      ...AuthSchema,
      body: LoginDto.input,
    }
  )

  .post('/register', ({ body }) => AuthUseCase.register(body), {
    body: RegisterDto.input,
  })

  .post(
    '/refresh-token',
    ({ cookie }) =>
      AuthUseCase.refreshToken({
        refreshToken: cookie['auth.refresh_token'].value ?? '',
      }).pipe(
        Effect.tap(({ accessToken, refreshToken, expiresAt: expires }) => {
          cookie['auth.access_token'].set({ value: accessToken })
          cookie['auth.refresh_token'].set({ value: refreshToken, expires })
        })
      ),
    AuthSchema
  )

  .get(
    '/:provider',
    ({ params, cookie, query }) =>
      Effect.gen(function* oauth() {
        const provider = yield* InfrastructureOAuthModule.forProvider(
          params.provider
        )

        const state = generateStateOrCode()
        const code = generateStateOrCode()
        const url = yield* provider.createAuthorizationUrl(state, code)

        cookie['auth.state'].set({ value: state })
        cookie['auth.code'].set({ value: code })
        cookie['auth.redirect_uri'].set({ value: query.redirect_uri })
        return yield* HttpError.redirect(url.href)
      }),
    AuthSchema
  )

  .get(
    '/:provider/callback',
    ({ params, cookie, query, request }) =>
      Effect.gen(function* oauthCallback() {
        const provider = yield* InfrastructureOAuthModule.forProvider(
          params.provider
        )

        const { state, code } = query
        const storedState = cookie['auth.state'].value ?? ''
        const storedCode = cookie['auth.code'].value ?? ''
        const redirectUri = cookie['auth.redirect_uri'].value ?? '/'

        if (!state || !code || state !== storedState)
          return yield* HttpError.badRequest('Invalid state or code')

        const user = yield* provider.fetchUserData(code, storedCode)

        cookie['auth.state'].remove()
        cookie['auth.code'].remove()
        cookie['auth.redirect_uri'].remove()

        return yield* AuthUseCase.loginWithOAuth({
          ...user,
          provider: params.provider,
        }).pipe(
          Effect.tap(({ accessToken, refreshToken, expiresAt: expires }) => {
            cookie['auth.access_token'].set({ value: accessToken })
            cookie['auth.refresh_token'].set({ value: refreshToken, expires })
          }),
          Effect.flatMap(({ accessToken, refreshToken, expiresAt }) => {
            const url = new URL(redirectUri, request.url)

            if (!redirectUri.startsWith('/')) {
              url.searchParams.set('access_token', accessToken)
              url.searchParams.set('refresh_token', refreshToken)
              url.searchParams.set('expires_at', expiresAt.toUTCString())
            }

            return HttpError.redirect(url.href)
          })
        )
      }),
    AuthSchema
  )
