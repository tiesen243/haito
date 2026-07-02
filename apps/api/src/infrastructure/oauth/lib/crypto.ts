export async function generateCodeChallenge(
  codeVerifier: string
): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const base64String = btoa(String.fromCodePoint(...new Uint8Array(digest)))
  return base64String
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll(/[=]/g, '')
}

export function generateStateOrCode(): string {
  const randomValues = new Uint8Array(32)
  crypto.getRandomValues(randomValues)
  return btoa(String.fromCodePoint(...randomValues))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll(/[=]/g, '')
}
