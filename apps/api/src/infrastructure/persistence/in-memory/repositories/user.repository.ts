import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import { UserRepository } from '@/domain/repositories/user.repository'
import { InMemoryClient } from '@/infrastructure/persistence/in-memory/in-memory.client'

export const InMemoryUserRepository = Layer.effect(
  UserRepository,
  Effect.gen(function* InMemoryUserRepositoryImpl() {
    const { users } = yield* InMemoryClient

    return {
      findBy: (criteria) =>
        Ref.get(users).pipe(
          Effect.map((map) => 
            (
              [...map.values()].find((user) =>
                Object.entries(criteria).every(
                  ([key, value]) => user[key as keyof typeof user] === value
                )
              ) ?? null
            )
          )
        ),

      save: (user) =>
        Ref.update(users, (map) => map.set(user.id, user)).pipe(Effect.asVoid),
    }
  })
)
