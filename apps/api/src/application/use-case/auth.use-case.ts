import type { LoginDto, RegisterDto } from '@/application/dto/auth.dto'
import type { InfrastructureOAuthModule } from '@/infrastructure/oauth/oauth.module'

import { Account } from '@/domain/entities/account.entity'
import { Session } from '@/domain/entities/session.entity'
import { User } from '@/domain/entities/user.entity'
import { AccountRepository } from '@/domain/repositories/account.repository'
import { SessionRepository } from '@/domain/repositories/session.repository'
import { UserRepository } from '@/domain/repositories/user.repository'
import { env } from '@/shared/env'
import { HttpError } from '@/shared/http-error'
import {
  encodeHex,
  generateSecureString,
  hashSecret,
} from '@/shared/lib/crypto'
import { JWT } from '@/shared/lib/jwt'
import { Password } from '@/shared/lib/password'
import { createUseCase, runTransaction } from '@/shared/lib/utils'

const password = new Password()
const jwt = new JWT(env.AUTH_SECRET)

export const whoamiUseCase = createUseCase<{ token: string }, User>(
  ({ token }) =>
    function* whoamiUseCaseFunc() {
      const userRepository = yield* UserRepository

      const { sub } = yield* jwt.verify(token)
      if (!sub) return yield* HttpError.unauthorized('Invalid token')

      const user = yield* userRepository.findBy({ id: sub })
      if (!user) return yield* HttpError.notFound('User not found')

      return user
    }
)

export const loginUseCase = createUseCase<LoginDto.Input, LoginDto.Output>(
  (input) =>
    function* loginUseCaseFunc() {
      const accountRepository = yield* AccountRepository
      const userRepository = yield* UserRepository

      const user = yield* userRepository.findBy({ email: input.email })
      if (!user) return yield* HttpError.unauthorized('Invalid credentials')

      const account = yield* accountRepository.findByProvider({
        provider: 'credentials',
        providerAccountId: user.id,
      })
      if (!account || !account.password)
        return yield* HttpError.unauthorized('Invalid credentials')

      const isValid = yield* password.verify(account.password, input.password)
      if (!isValid) return yield* HttpError.unauthorized('Invalid credentials')

      return yield* createSession({ userId: account.userId })
    }
)

export const loginWithOAuthUseCase = createUseCase<
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

          let user = yield* userRepository.findBy({ email: input.email })
          if (user) userId = user.id
          else {
            user = User.create({
              username: input.name,
              email: input.email,
              image: input.image,
            })
            yield* userRepository.save(user)

            userId = user.id
          }

          account = Account.create({
            provider: input.provider,
            providerAccountId: input.id,
            password: null,
            userId,
          })
          yield* accountRepository.save(account)
        }

        return yield* createSession({ userId: account.userId })
      })
    }
)

export const registerUseCase = createUseCase<
  RegisterDto.Input,
  RegisterDto.Output
>(
  (input) =>
    function* registerUseCaseFunc() {
      const { username, email, password: plainPassword } = input

      const accountRepository = yield* AccountRepository
      const userRepository = yield* UserRepository

      const existingUser = yield* userRepository.findBy({ email })
      if (existingUser) return yield* HttpError.conflict('User already exists')

      return yield* runTransaction(function* registerTransaction() {
        const user = User.create({ username, email, image: null })
        yield* userRepository.save(user)

        const existingAccount = yield* accountRepository.findByProvider({
          provider: 'credentials',
          providerAccountId: user.id,
        })
        if (existingAccount)
          return yield* HttpError.conflict('User already exists')

        const account = Account.create({
          provider: 'credentials',
          providerAccountId: user.id,
          password: yield* password.hash(plainPassword),
          userId: user.id,
        })
        yield* accountRepository.save(account)

        return { id: user.id }
      })
    }
)

const createSession = createUseCase<{ userId: string }, LoginDto.Output>(
  ({ userId }) =>
    function* createSessionFunc() {
      const sessionRepository = yield* SessionRepository

      const id = generateSecureString()
      const secret = generateSecureString()
      const hashedSecret = yield* hashSecret(secret)

      const refreshToken = `${id}.${secret}`
      const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000) // 7 days

      const session = Session.create({
        id,
        userId,
        token: encodeHex(hashedSecret),
        expiresAt,
      })
      yield* sessionRepository.save(session)

      const accessToken = yield* jwt.sign(
        { sub: userId },
        { expiresIn: 15 * 60 } // 15 minutes
      )

      return { accessToken, refreshToken, expiresAt }
    }
)

export default {
  whoami: whoamiUseCase,
  login: loginUseCase,
  loginWithOAuth: loginWithOAuthUseCase,
  register: registerUseCase,
}
