import type { ListPostsModel } from '@haito/validators/models/post'

import { Button } from '@haito/ui/button'
import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

export default function Index() {
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      api
        .get<ListPostsModel.Output>('/posts')
        .then((res) => (res.error ? Promise.reject(res.error) : res.data)),
  })
  return (
    <main className='container py-4'>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Button onClick={() => refetch()} disabled={isRefetching}>
        {isRefetching ? 'Loading...' : 'Refetch'}
      </Button>
    </main>
  )
}
