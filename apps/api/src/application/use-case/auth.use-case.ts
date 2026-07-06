import type { LoginDto, RegisterDto } from '@/application/dto/auth.dto'

import { Account } from '@/domain/entities/account.entity'
import { User } from '@/domain/entities/user.entity'
import { AccountRepository } from '@/domain/repositories/account.repository'
import { UserRepository } from '@/domain/repositories/user.repository'
import { HttpError } from '@/shared/http-error'
import { createUseCase } from '@/shared/lib/create-use-case'
import { Password } from '@/shared/lib/password'

const password = new Password()

export const loginUseCase = createUseCase<LoginDto.Input, LoginDto.Output>(
  (input) =>
    function* loginUseCaseFunc() {
      const accountRepository = yield* AccountRepository

      const account = yield* accountRepository.findByProvider({
        provider: 'credentials',
        providerAccountId: input.email,
      })
      if (!account || !account.password)
        return yield* HttpError.unauthorized('Invalid credentials')

      const isValid = yield* password.verify(account.password, input.password)
      if (!isValid) return yield* HttpError.unauthorized('Invalid credentials')

      return account.user
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

      const existingAccount = yield* accountRepository.findByProvider({
        provider: 'credentials',
        providerAccountId: input.email,
      })
      if (existingAccount)
        return yield* HttpError.conflict('User already exists')

      const user = User.create({ username, email, image: null })
      yield* userRepository.save(user)

      const hashedPassword = yield* password.hash(plainPassword)
      const account = Account.create({
        provider: 'credentials',
        providerAccountId: email,
        password: hashedPassword,
        userId: user.id,
      })
      yield* accountRepository.save(account)

      return { id: user.id }
    }
)

export default {
  login: loginUseCase,
  register: registerUseCase,
}
