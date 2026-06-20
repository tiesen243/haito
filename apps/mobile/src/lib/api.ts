import { Api } from '@haito/lib/api'

export const api = new Api('http://localhost:3000/api', {
  'x-client': 'react-native',
})
