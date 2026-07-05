import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Ref from 'effect/Ref'

import { Account } from '@/domain/entities/account.entity'
import { AccountRepository } from '@/domain/repositories/account.repository'

const store = Ref.unsafeMake<Record<string, Account>>({})

export const AccountRepositoryInMemory = Layer.succeed(AccountRepository, {
  findByProvider: (provider, providerAccountId) =>
    Effect.gen(function* findByProviderFunc() {
      const [account] = yield* Ref.get(store).pipe(
        Effect.map((dict) =>
          Object.values(dict).filter(
            (_account) =>
              _account.provider === provider &&
              _account.providerAccountId === providerAccountId
          )
        )
      )

      return account ? new Account(account) : null
    }),

  save: (account) =>
    Effect.gen(function* saveFunc() {
      yield* Ref.update(store, (dict) => ({
        ...dict,
        [`${account.provider}_${account.providerAccountId}`]: account,
      }))
    }),
})
