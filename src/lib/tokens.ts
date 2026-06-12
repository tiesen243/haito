import * as Keychain from 'react-native-keychain'

import { TOKEN_KEY } from '@/lib/constants'

interface Tokens {
  accessToken?: string | null
  refreshToken?: string | null
}

async function setTokens(tokens: Tokens): Promise<void> {
  const credentials = await Keychain.getGenericPassword({ service: TOKEN_KEY })

  let refreshToken = credentials ? credentials.username : null
  let accessToken = credentials ? credentials.password : null

  if (tokens.refreshToken !== undefined && tokens.refreshToken !== null)
    refreshToken = tokens.refreshToken

  if (tokens.accessToken !== undefined && tokens.accessToken !== null)
    accessToken = tokens.accessToken

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
  } catch {}

  return { accessToken: null, refreshToken: null }
}

export { setTokens, getTokens }
