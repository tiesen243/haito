import * as Context from 'effect/Context'

import type { IRepositoryBase } from '@/domain/abstracts/repository.base'
import type { Session } from '@/domain/entities/session.entity'

// oxlint-disable-next-line typescript/no-empty-interface, typescript/no-empty-object-type
export interface ISessionRepository extends IRepositoryBase<Session> {}

export class SessionRepository extends Context.Tag(
  'domain/repository/SessionRepository'
)<SessionRepository, ISessionRepository>() {}
