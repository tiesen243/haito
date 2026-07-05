import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import type { User, UserProps } from '@/domain/entities/user.entity'

import { UserRepository } from '@/domain/repositories/user.repository'

const users = Ref.unsafeMake<Map<UserProps['id'], UserProps>>(new Map())

export const InMemoryUserRepository = Layer.succeed(UserRepository, {
  all: () => Ref.get(users).pipe(Effect.map((dict) => [...dict.values()])),

  find: (id: UserProps['id']) =>
    Ref.get(users).pipe(Effect.map((dict) => dict.get(id) ?? null)),

  save: (user: User) =>
    Ref.update(users, (dict) => new Map(dict).set(user.id, user)).pipe(
      Effect.map(() => user)
    ),
})
