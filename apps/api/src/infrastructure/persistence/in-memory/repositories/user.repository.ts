import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import type { User } from '@/domain/entities/user.entity'

import { UserRepository } from '@/domain/repositories/user.repository'

const store = Ref.unsafeMake<Record<string, User>>({})

export const UserRepositoryInMemory = Layer.succeed(UserRepository, {
  findBy: (criterias) =>
    Ref.get(store).pipe(
      Effect.map(
        (dict) =>
          Object.values(dict).find((user) =>
            Object.entries(criterias).every(
              ([key, value]) => user[key as keyof User] === value
            )
          ) ?? null
      )
    ),

  save: (user) => Ref.update(store, (dict) => ({ ...dict, [user.id]: user })),
})
