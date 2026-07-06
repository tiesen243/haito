// oxlint-disable typescript/no-this-alias unicorn/no-this-assignment
import * as Effect from 'effect/Effect'
import { scrypt } from 'node:crypto'
import { promisify } from 'node:util'

import { constantTimeEqual, decodeHex, encodeHex } from '@/shared/lib/crypto'

export class Password {
  public constructor(private readonly dkLen = 64) {}

  public hash = (password: string): Effect.Effect<string> => {
    const self = this

    return Effect.gen(function* hashFunc() {
      const salt = encodeHex(crypto.getRandomValues(new Uint8Array(16)))
      const key = yield* self.generateKey(password.normalize('NFKC'), salt)
      return `${salt}:${encodeHex(key)}`
    })
  }

  public verify = (hash: string, password: string): Effect.Effect<boolean> => {
    const self = this

    return Effect.gen(function* verifyFunc() {
      const parts = hash.split(':')
      if (parts.length !== 2) return false

      const [salt, key] = parts
      const targetKey = yield* self.generateKey(
        password.normalize('NFKC'),
        salt
      )
      return constantTimeEqual(targetKey, decodeHex(key ?? ''))
    })
  }

  private generateKey = (
    data: string,
    salt?: string
  ): Effect.Effect<Uint8Array> => {
    const self = this

    return Effect.gen(function* generateKeyFunc() {
      const textEncoder = new TextEncoder()
      const key = yield* Effect.promise(
        () =>
          promisify(scrypt)(
            textEncoder.encode(data),
            textEncoder.encode(salt),
            self.dkLen
          ) as Promise<Uint8Array>
      )
      return new Uint8Array(key)
    })
  }
}
