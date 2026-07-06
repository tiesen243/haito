import type * as Effect from 'effect/Effect'

import * as Context from 'effect/Context'

import type { User } from '@/domain/entities/user.entity'
import type { HttpError } from '@/shared/http-error'

export class UserRepository extends Context.Tag(
  'domain/repository/UserRepository'
)<
  UserRepository,
  {
    save: (user: User) => Effect.Effect<void, HttpError>
  }
>() {}
