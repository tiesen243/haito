import '@/globals.css'

import { createStaticNavigation, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, useState } from 'react'
import { StatusBar } from 'react-native'
import { hide } from 'react-native-bootsplash'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useCSSVariable, useUniwind } from 'uniwind'

import * as Tabs from '@/app/(tabs)/__root'
import { restoreTheme } from '@/lib/theme'

const RootStack = createNativeStackNavigator({
  screens: {
    tabs: {
      screen: Tabs.Root,
      options: { title: 'Haito', headerRight: Tabs.HeaderRight },
    },

    login: {
      screen: lazy(() => import('@/app/login')),
      options: { title: 'Login' },
    },
  },
})

const Navigation = createStaticNavigation(RootStack)

export default function Root() {
  const { theme } = useUniwind()
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Navigation
          onReady={() => {
            restoreTheme()
            hide({ fade: true })
          }}
          theme={{
            ...DefaultTheme,
            colors: {
              background: String(
                useCSSVariable('--color-background') ??
                  DefaultTheme.colors.background
              ),
              text: String(
                useCSSVariable('--color-foreground') ?? DefaultTheme.colors.text
              ),
              border: String(
                useCSSVariable('--color-border') ?? DefaultTheme.colors.border
              ),
              card: String(
                useCSSVariable('--color-card') ?? DefaultTheme.colors.card
              ),
              primary: String(
                useCSSVariable('--color-primary') ?? DefaultTheme.colors.primary
              ),
              notification: String(
                useCSSVariable('--color-popover') ??
                  DefaultTheme.colors.notification
              ),
            },
          }}
        />

        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}

declare module '@react-navigation/native' {
  type RootStackType = typeof RootStack

  interface RootNavigator extends RootStackType {}
}
