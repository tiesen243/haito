import * as Context from 'effect/Context'

import type { User } from '@/domain/entities/user.entity'

import { env } from '@/shared/env'
import { JWT } from '@/shared/lib/jwt'
import { Password } from '@/shared/lib/password'

export class Auth extends Context.Tag('application/context/Auth')<
  Auth,
  User
>() {
  static jwt = new JWT(env.AUTH_SECRET)
  static password = new Password()
}
