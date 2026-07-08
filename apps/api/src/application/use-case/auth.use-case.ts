import type {
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from '@/application/dto/auth.dto'
import type { InfrastructureOAuthModule } from '@/infrastructure/oauth/oauth.module'

import { Auth } from '@/application/context'
import { Account } from '@/domain/entities/account.entity'
import { Session } from '@/domain/entities/session.entity'
import { User } from '@/domain/entities/user.entity'
import { AccountRepository } from '@/domain/repositories/account.repository'
import { SessionRepository } from '@/domain/repositories/session.repository'
import { UserRepository } from '@/domain/repositories/user.repository'
import { HttpError } from '@/shared/http-error'
import {
  constantTimeEqual,
  decodeHex,
  encodeHex,
  generateSecureString,
  hashSecret,
} from '@/shared/lib/crypto'
import { createUseCase, runTransaction } from '@/shared/lib/utils'

// oxlint-disable-next-line typescript/no-extraneous-class
export class AuthUseCase {
  // oxlint-disable-next-line typescript/no-invalid-void-type
  public static whoami = createUseCase<void, User>(
    () =>
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      function* whoamiUseCaseFunc() {
        return yield* Auth
      }
  )

  public static login = createUseCase<LoginDto.Input, LoginDto.Output>(
    (input) =>
      function* loginUseCaseFunc() {
        const accountRepository = yield* AccountRepository
        const userRepository = yield* UserRepository

        const [user] = yield* userRepository.find([{ email: input.email }])
        if (!user) return yield* HttpError.unauthorized('Invalid credentials')

        const account = yield* accountRepository.findByProvider({
          provider: 'credentials',
          providerAccountId: user.id,
        })
        if (!account || !account.password)
          return yield* HttpError.unauthorized('Invalid credentials')

        const isValid = yield* Auth.password.verify(
          account.password,
          input.password
        )
        if (!isValid)
          return yield* HttpError.unauthorized('Invalid credentials')

        return yield* AuthUseCase.createSession({ userId: account.userId })
      }
  )

  public static loginWithOAuth = createUseCase<
    InfrastructureOAuthModule.User & { provider: string },
    LoginDto.Output
  >(
    (input) =>
      function* loginWithOAuthUseCaseFunc() {
        const accountRepository = yield* AccountRepository
        const userRepository = yield* UserRepository

        let account = yield* accountRepository.findByProvider({
          provider: input.provider,
          providerAccountId: input.id,
        })

        return yield* runTransaction(function* loginWithOAuthTransaction() {
          if (!account) {
            let userId = ''

            let [user] = yield* userRepository.find([{ email: input.email }])
            if (user) userId = user.id
            else {
              user = User.make({
                username: input.name,
                email: input.email,
                image: input.image,
              })
              yield* userRepository.save(user)

              userId = user.id
            }

            account = Account.make({
              provider: input.provider,
              providerAccountId: input.id,
              password: null,
              userId,
            })
            yield* accountRepository.save(account)
          }

          return yield* AuthUseCase.createSession({ userId: account.userId })
        })
      }
  )

  public static register = createUseCase<RegisterDto.Input, RegisterDto.Output>(
    (input) =>
      function* registerUseCaseFunc() {
        const { username, email, password: plainPassword } = input

        const accountRepository = yield* AccountRepository
        const userRepository = yield* UserRepository

        const [existingUser] = yield* userRepository.find([{ username, email }])
        if (existingUser)
          return yield* HttpError.conflict('Username or email already exists')

        return yield* runTransaction(function* registerTransaction() {
          const user = User.make({ username, email, image: null })
          yield* userRepository.save(user)

          const account = Account.make({
            provider: 'credentials',
            providerAccountId: user.id,
            password: yield* Auth.password.hash(plainPassword),
            userId: user.id,
          })
          yield* accountRepository.save(account)

          return { id: user.id }
        })
      }
  )

  public static refreshToken = createUseCase<
    RefreshTokenDto.Input,
    RefreshTokenDto.Output
  >(
    (input) =>
      function* refreshTokenUseCaseFunc() {
        const sessionRepository = yield* SessionRepository

        const [id, secret] = input.refreshToken.split('.')
        if (!id || !secret)
          return yield* HttpError.unauthorized('Invalid refresh token')

        let [session] = yield* sessionRepository.find(
          [{ id }],
          {},
          { limit: 1 }
        )
        if (!session)
          return yield* HttpError.unauthorized('Invalid refresh token')

        const now = Date.now()
        const expiresTime = new Date(session.expiresAt).getTime()
        const isValid = constantTimeEqual(
          yield* hashSecret(secret),
          decodeHex(session.token)
        )

        if (!isValid || now >= expiresTime) {
          yield* sessionRepository.delete(session)
          return yield* HttpError.unauthorized('Refresh token expired')
        }

        if (now >= expiresTime - Auth.sessionTokenThreshold) {
          const newExpiresAt = new Date(now + Auth.sessionTokenExpiration)
          session = session.clone({ expiresAt: newExpiresAt })
          yield* sessionRepository.save(session)
        }

        const accessToken = yield* Auth.jwt.sign(
          { sub: session.userId },
          { expiresIn: Auth.accessTokenExpiration }
        )

        return {
          accessToken,
          refreshToken: input.refreshToken,
          expiresAt: session.expiresAt,
        }
      }
  )

  private static createSession = createUseCase<
    { userId: string },
    LoginDto.Output
  >(
    ({ userId }) =>
      function* createSessionFunc() {
        const sessionRepository = yield* SessionRepository

        const id = generateSecureString()
        const secret = generateSecureString()
        const hashedSecret = yield* hashSecret(secret)

        const refreshToken = `${id}.${secret}`
        const expiresAt = new Date(Date.now() + Auth.sessionTokenExpiration)

        const session = Session.make({
          id,
          userId,
          token: encodeHex(hashedSecret),
          expiresAt,
        })
        yield* sessionRepository.save(session)

        const accessToken = yield* Auth.jwt.sign(
          { sub: userId },
          { expiresIn: Auth.accessTokenExpiration }
        )

        return { accessToken, refreshToken, expiresAt }
      }
  )
}
