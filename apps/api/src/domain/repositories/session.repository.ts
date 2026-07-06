import type * as Effect from 'effect/Effect'

import * as Context from 'effect/Context'

import type { Session } from '@/domain/entities/session.entity'
import type { HttpError } from '@/shared/http-error'

export class SessionRepository extends Context.Tag(
  'domain/repository/SessionRepository'
)<
  SessionRepository,
  {
    save: (session: Session) => Effect.Effect<void, HttpError>
  }
>() {}
