import { drizzle } from 'drizzle-orm/postgres-js'
import { Context, Effect, Layer } from 'effect'
import postgres from 'postgres'

type DrizzleInstance = ReturnType<typeof drizzle>

export class DrizzleClient extends Context.Tag('DrizzleClient')<
  DrizzleClient,
  {
    client: DrizzleInstance
    readonly query: <T>(
      cb: (client: DrizzleInstance) => Promise<T>
    ) => Effect.Effect<T>
  }
>() {
  static live = Layer.effect(
    this,
    // oxlint-disable-next-line require-yield
    Effect.gen(function* makeDrizzleClient() {
      const conn = postgres('postgres://postgres:secret@127.0.0.1:5432/db')
      const db = drizzle(conn, { casing: 'snake_case' })

      return {
        client: db,
        // oxlint-disable-next-line promise/prefer-await-to-callbacks
        query: (cb) => Effect.promise(() => cb(db)),
      }
    })
  )
}
