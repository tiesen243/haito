import type { ThemeName } from 'uniwind'

import * as Keychain from 'react-native-keychain'
import { Uniwind } from 'uniwind'

import { THEME_KEY } from '@/lib/constants'

async function setTheme(theme: ThemeName | 'system'): Promise<void> {
  await Keychain.setGenericPassword('theme', theme, { service: THEME_KEY })
  Uniwind.setTheme(theme)
}

async function restoreTheme(): Promise<void> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: THEME_KEY,
    })
    if (credentials) Uniwind.setTheme(credentials.password as ThemeName)
  } catch {
    // Ignore error
  }
}

export { setTheme, restoreTheme }
