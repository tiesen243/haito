import * as Effect from 'effect/Effect'
import { Elysia } from 'elysia'

import { Auth } from '@/application/context'
import { UserRepository } from '@/domain/repositories/user.repository'
import { HttpError } from '@/shared/http-error'

export const authMiddleware = new Elysia({
  name: 'presentation/middleware/auth.middleware',
})
  .onAfterHandle(({ cookie, headers, responseValue }) => {
    if (!Effect.isEffect(responseValue)) return responseValue
    return Effect.gen(function* authMiddlewareFunc() {
      const userRepository = yield* UserRepository

      const token = String(
        headers.authorization?.replace('Bearer ', '') ??
          cookie['auth.access_token']?.value ??
          ''
      )
      if (!token) return yield* HttpError.unauthorized('Missing token')

      const { sub } = yield* Auth.jwt.verify(token)
      if (!sub) return yield* HttpError.unauthorized('Invalid token')

      const [user] = yield* userRepository.find([{ id: sub }], {}, { limit: 1 })
      if (!user) return yield* HttpError.unauthorized('Invalid token')

      return yield* responseValue.pipe(Effect.provideService(Auth, user))
    })
  })
  .as('scoped')
