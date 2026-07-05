import * as Effect from 'effect/Effect'
import { Elysia, t } from 'elysia'

import { User } from '@/domain/entities/user.entity'
import { UserRepository } from '@/domain/repositories/user.repository'
import { runTransaction } from '@/shared/run-transaction'

export const userController = new Elysia({
  name: 'presentation/http/user.controller',
  prefix: '/api/users',
  tags: ['user'],
})

  .get('/', () =>
    Effect.gen(function* getUsers() {
      const userRepo = yield* UserRepository

      return yield* userRepo.all()
    })
  )

  .get('/:id', ({ params }) =>
    Effect.gen(function* getUser() {
      const userRepo = yield* UserRepository

      return yield* runTransaction(function* getUserTransaction() {
        return yield* userRepo.find(params.id)
      })
    })
  )

  .post(
    '/',
    ({ body }) =>
      Effect.gen(function* createUser() {
        const userRepo = yield* UserRepository

        const user = User.create(body)
        return yield* userRepo.save(user)
      }),
    {
      body: t.Object({
        username: t.String(),
        email: t.String({ format: 'email' }),
        image: t.Nullable(t.String()),
      }),
    }
  )
