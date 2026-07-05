import { eq } from 'drizzle-orm'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import type { User, UserProps } from '@/domain/entities/user.entity'

import { UserRepository } from '@/domain/repositories/user.repository'
import { Drizzle } from '@/infrastructure/persistence/drizzle/drizzle.client'

export const DrizzleUserRepository = Layer.effect(
  UserRepository,
  Effect.gen(function* DrizzleUserRepositoryImpl() {
    const db = yield* Drizzle
    const { users } = Drizzle.schema

    return {
      all: () => db.select().from(users),

      find: (id: UserProps['id']) =>
        db
          .select()
          .from(users)
          .where(eq(users.id, id))
          .pipe(Effect.map((results) => results[0] ?? null)),

      save: (user: User) => db.insert(users).values({ ...user }),
    }
  })
)
