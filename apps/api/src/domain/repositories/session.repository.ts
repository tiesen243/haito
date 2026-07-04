import type { Effect } from 'effect/Effect'

import * as Context from 'effect/Context'

import type { Session } from '@/domain/entities/session.entity'
import type { HttpError } from '@/shared/http-error'

export class SessionRepository extends Context.Tag('domain/SessionRepository')<
  SessionRepository,
  {
    readonly save: (account: Session) => Effect<void, HttpError>
  }
>() {}
