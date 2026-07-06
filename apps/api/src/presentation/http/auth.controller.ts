import { Effect } from 'effect'
import { Elysia } from 'elysia'

import { LoginDto, RegisterDto } from '@/application/dto/auth.dto'
import { AuthSchema } from '@/application/types/auth.type'
import usecase from '@/application/use-case/auth.use-case'

export const authController = new Elysia({
  name: 'presentation/http/auth.controller',
  prefix: '/api/auth',
  tags: ['auth'],
})

  .get(
    '/whoami',
    ({ cookie, headers }) => {
      const token =
        headers.authorization?.replace('Bearer ', '') ??
        cookie['auth.access_token'].value ??
        ''
      return usecase.whoami({ token })
    },
    AuthSchema
  )

  .post(
    '/login',
    ({ body, cookie }) =>
      usecase.login(body).pipe(
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

  .post('/register', ({ body }) => usecase.register(body), {
    body: RegisterDto.input,
  })
