import * as Keychain from 'react-native-keychain'

const TOKEN_KEY = 'auth.tokens'

interface Tokens {
  accessToken?: string | null
  refreshToken?: string | null
}

async function setTokens(tokens: Tokens): Promise<void> {
  const credentials = await Keychain.getGenericPassword({ service: TOKEN_KEY })

  let refreshToken = credentials ? credentials.username : ''
  let accessToken = credentials ? credentials.password : ''

  if (tokens.refreshToken !== undefined && tokens.refreshToken !== null)
    ({ refreshToken } = tokens)

  if (tokens.accessToken !== undefined && tokens.accessToken !== null)
    ({ accessToken } = tokens)

  await Keychain.setGenericPassword(refreshToken, accessToken, {
    service: TOKEN_KEY,
  })
}

async function getTokens(): Promise<Tokens> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_KEY,
    })
    if (credentials)
      return {
        refreshToken: credentials.username ?? null,
        accessToken: credentials.password ?? null,
      }
  } catch {
    // Ignore error and return null tokens
  }

  return { accessToken: null, refreshToken: null }
}

export { setTokens, getTokens }
