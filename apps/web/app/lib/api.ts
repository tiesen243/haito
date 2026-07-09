import { Api } from '@haito/lib/api'

import { env } from '@/env'

export const api = new Api(`${env.VITE_API_URL}/api`, {
  headers: {
    'X-Requested-With': 'react-router',
  },
  onError: async (status, message) => {
    if (status === 401 && message.toLowerCase().includes('token'))
      await fetch(`${env.VITE_API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      })
  },
})
