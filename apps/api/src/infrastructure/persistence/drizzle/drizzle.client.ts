import { drizzle } from 'drizzle-orm/postgres-js'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import postgres from 'postgres'

import * as schema from '@/infrastructure/persistence/drizzle/drizzle.schema'
import { env } from '@/shared/env'
import { HttpError } from '@/shared/http-error'

export class DrizzleClient extends Context.Tag(
  'infrastructure/persistence/drizzle'
)<
  DrizzleClient,
  {
    db: ReturnType<typeof drizzle>
    $: <T>(query: PromiseLike<T>) => Effect.Effect<T, HttpError>
  }
>() {
  static schema = schema
  public static client = drizzle({ client: postgres(env.DATABASE_URL) })

  public static live = Layer.succeed(DrizzleClient, DrizzleClient.make())
  public static make(client = DrizzleClient.client) {
    return {
      db: client,
      $: <T>(query: PromiseLike<T>) =>
        Effect.tryPromise({
          try: () => query,
          catch: (e) =>
            HttpError.internalServerError('Drizzle query failed', e),
        }),
    }
  }
}
