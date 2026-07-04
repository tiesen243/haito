import * as Effect from 'effect/Effect'

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false

  let c = 0
  // oxlint-disable-next-line no-bitwise
  for (let i = 0; i < a.byteLength; i += 1) c |= (a[i] ?? 0) ^ (b[i] ?? 0)
  return c === 0
}

export function generateSecureString(): string {
  const alphabet = 'abcdefghijklmnpqrstuvwxyz23456789'

  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)

  let id = ''
  // oxlint-disable-next-line no-bitwise
  for (const b of bytes) id += alphabet[b >> 3] ?? ''

  return id
}

export const generateCodeChallenge = (
  codeVerifier: string
): Effect.Effect<string, never, never> =>
  Effect.gen(function* generateCodeChallengeFunc() {
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = yield* Effect.promise(() =>
      crypto.subtle.digest('SHA-256', data)
    )
    const base64String = btoa(String.fromCodePoint(...new Uint8Array(digest)))
    return base64String
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll(/[=]/g, '')
  })

export function generateStateOrCode(): string {
  const randomValues = new Uint8Array(32)
  crypto.getRandomValues(randomValues)
  return btoa(String.fromCodePoint(...randomValues))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll(/[=]/g, '')
}

export const hashSecret = (secret: string) =>
  Effect.gen(function* hashSecretFunc() {
    const secretBytes = new TextEncoder().encode(secret)
    const secretHashBuffer = yield* Effect.promise(() =>
      crypto.subtle.digest('SHA-256', secretBytes)
    )
    return new Uint8Array(secretHashBuffer)
  })

export function encodeBase64Url(bytes: Uint8Array): string {
  const binary = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(
    ''
  )
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll(/=+$/g, '')
}

export function decodeBase64Url(base64url: string): Uint8Array {
  const base64 = base64url.replaceAll('-', '+').replaceAll('_', '/')
  const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(paddedBase64)

  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1)
    bytes[i] = binary.codePointAt(i) ?? 0
  return bytes
}

export function encodeHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  )
}

export function decodeHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string')

  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2)
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16)

  return bytes
}
