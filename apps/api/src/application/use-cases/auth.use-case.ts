import { Effect } from 'effect'

import type { OAuthService } from '@/application/services/oauth.service'

import { JWT } from '@/application/services/jwt.service'
import { Account } from '@/domain/entities/account.entity'
import { Session } from '@/domain/entities/session.entity'
import { User } from '@/domain/entities/user.entity'
import { AccountRepository } from '@/domain/repositories/account.repository'
import { SessionRepository } from '@/domain/repositories/session.repository'
import { UserRepository } from '@/domain/repositories/user.repository'
import { Config } from '@/shared/config'
import { HttpError } from '@/shared/http-error'
import { createUseCase } from '@/shared/lib/create-use-case'
import {
  encodeHex,
  generateSecureString,
  hashSecret,
} from '@/shared/lib/crypto'

export const getCurrentUserUseCase = createUseCase<
  { accessToken?: string },
  User | null
>(
  (input) =>
    function* getCurrentUserUseCaseFunc() {
      const userRepo = yield* UserRepository
      const jwt = yield* JWT

      if (!input.accessToken)
        return yield* HttpError.unauthorized('Access token is required')

      const data = yield* jwt.verify(input.accessToken)
      return yield* userRepo.findBy({ id: data.sub })
    }
)

export const getOrCreateAccountUseCase = createUseCase<
  OAuthService.User & { provider: string },
  { accessToken: string; refreshToken: string; expiresAt: Date }
>(
  (input) =>
    function* getOrCreateAccountUseCaseFunc() {
      const accountRepo = yield* AccountRepository
      const userRepo = yield* UserRepository

      const { provider, id: providerAccountId, email, image, name } = input

      let user = yield* userRepo.findBy({ email })
      if (!user) {
        user = User.create({ username: name, email, image })
        yield* userRepo.save(user)
      }

      let account = yield* accountRepo.findByProvider(
        provider,
        providerAccountId
      )
      if (!account) {
        account = Account.create({
          provider,
          providerAccountId,
          userId: user.id,
        })
        yield* accountRepo.save(account)
      }

      return yield* createSession(user.id)
    }
)

const createSession = (userId: string) =>
  Effect.gen(function* createSessionFunc() {
    const sessionRepo = yield* SessionRepository
    const config = yield* Config
    const jwt = yield* JWT

    const id = generateSecureString()
    const secret = generateSecureString()
    const hashedSecret = yield* hashSecret(secret)

    const refreshToken = `${id}.${secret}`
    const expiresAt = new Date(
      Date.now() + (config.auth.session?.expiresIn ?? 0) * 1000
    )

    const session = Session.create({
      id,
      userId,
      token: encodeHex(hashedSecret),
      expiresAt,
    })
    yield* sessionRepo.save(session)

    const accessToken = yield* jwt.sign(
      { sub: userId },
      { expiresIn: config.auth.session?.accessTokenExpiresIn }
    )

    return { accessToken, refreshToken, expiresAt }
  })
