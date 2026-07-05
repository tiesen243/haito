import type { Effect } from 'effect/Effect'

import * as Context from 'effect/Context'

import type { User } from '@/domain/entities/user.entity'
import type { HttpError } from '@/shared/http-error'

export class UserRepository extends Context.Tag('domain/repository/User')<
  UserRepository,
  {
    readonly findBy: (
      criterias: Partial<User>
    ) => Effect<User | null, HttpError>

    readonly save: (user: User) => Effect<void, HttpError>
  }
>() {}
