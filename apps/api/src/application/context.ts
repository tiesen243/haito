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

  static sessionTokenExpiration = 60 * 60 * 24 * 7 * 1000 // 7 days
  static sessionTokenThreshold = 60 * 60 * 24 * 1000 // 1 day
  static accessTokenExpiration = 60 * 15 * 1000 // 15 minutes
}
