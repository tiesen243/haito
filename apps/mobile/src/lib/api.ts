import { Api } from '@haito/lib/api'

import { env } from '@/env'

export const api = new Api(`${env.PUBLIC_API_URL}/api`, {
  'x-client': 'react-native',
})
