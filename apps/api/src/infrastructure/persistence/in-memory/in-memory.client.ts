import * as Context from 'effect/Context'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import type { Account } from '@/domain/entities/account.entity'
import type { Session } from '@/domain/entities/session.entity'
import type { User } from '@/domain/entities/user.entity'

export class InMemoryClient extends Context.Tag(
  'infrastructure/persistence/in-memory'
)<
  InMemoryClient,
  {
    accounts: Ref.Ref<Map<string, Account>>
    users: Ref.Ref<Map<User['id'], User>>
    sessions: Ref.Ref<Map<Session['id'], Session>>
  }
>() {
  private static _accounts = Ref.unsafeMake<Map<string, Account>>(new Map())
  private static _users = Ref.unsafeMake<Map<User['id'], User>>(new Map())
  private static _sessions = Ref.unsafeMake<Map<Session['id'], Session>>(
    new Map()
  )

  public static live = Layer.succeed(InMemoryClient, {
    accounts: this._accounts,
    sessions: this._sessions,
    users: this._users,
  })
}
