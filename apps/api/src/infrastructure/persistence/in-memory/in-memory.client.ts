import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import type { Account } from '@/domain/entities/account.entity'
import type { Group } from '@/domain/entities/group.entity'
import type { Note } from '@/domain/entities/note.entity'
import type { Session } from '@/domain/entities/session.entity'
import type { User } from '@/domain/entities/user.entity'

export class InMemoryClient extends Context.Tag(
  'infrastructure/persistence/in-memory'
)<
  InMemoryClient,
  {
    accounts: Ref.Ref<Map<string, Account>>
    groups: Ref.Ref<Map<Group['id'], Group>>
    notes: Ref.Ref<Map<Note['id'], Note>>
    users: Ref.Ref<Map<User['id'], User>>
    sessions: Ref.Ref<Map<Session['id'], Session>>
  }
>() {
  public static live = Layer.effect(
    InMemoryClient,
    Effect.gen(function* liveImpl() {
      return {
        accounts: yield* Ref.make<Map<string, Account>>(new Map()),
        groups: yield* Ref.make<Map<Group['id'], Group>>(new Map()),
        notes: yield* Ref.make<Map<Note['id'], Note>>(new Map()),
        users: yield* Ref.make<Map<User['id'], User>>(new Map()),
        sessions: yield* Ref.make<Map<Session['id'], Session>>(new Map()),
      }
    })
  )
}
