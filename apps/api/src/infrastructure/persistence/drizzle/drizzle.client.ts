// oxlint-disable promise/prefer-await-to-callbacks
import { drizzle } from 'drizzle-orm/postgres-js'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import postgres from 'postgres'

import { HttpError } from '@/shared/http-error'
import { env } from '@/shared/lib/env'

type DrizzleInstance = ReturnType<typeof drizzle>

export class DrizzleClient extends Context.Tag('DrizzleClient')<
  DrizzleClient,
  {
    client: DrizzleInstance
    readonly query: <T>(
      cb: (client: DrizzleInstance) => Promise<T>
    ) => Effect.Effect<T, HttpError, never>
  }
>() {
  static live = Layer.effect(
    this,
    // oxlint-disable-next-line require-yield
    Effect.gen(function* DrizzleClientLive() {
      const conn = postgres({
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
      })
      const db = drizzle(conn, { casing: 'snake_case' })

      return {
        client: db,
        query: (cb) =>
          Effect.tryPromise({
            try: (_) => cb(db),
            catch: (error) =>
              HttpError.internalServerError('Database query failed', error),
          }),
      }
    })
  )
}
