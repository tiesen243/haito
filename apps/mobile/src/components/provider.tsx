import type { QueryClient } from '@tanstack/react-query'

import { createQueryClient } from '@haito/lib/create-query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'

let clientQueryClientSingleton: QueryClient | undefined
export const getQueryClient = () =>
  (clientQueryClientSingleton ??= createQueryClient())

export function Provider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SafeAreaProvider>
  )
}
