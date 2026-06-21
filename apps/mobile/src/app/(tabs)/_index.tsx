import type { ListPostsModel } from '@haito/validators/models/post'

import { Card, CardDescription, CardHeader, CardTitle } from '@haito/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@haito/ui/select'
import { useQuery } from '@tanstack/react-query'
import { FlatList } from 'react-native'

import { Container } from '@/components/container'
import { api } from '@/lib/api'

export default function TabsIndexScreen() {
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      api
        .get<ListPostsModel.Output>('/posts')
        .then((res) =>
          res.error ? Promise.reject(res.error) : Promise.resolve(res.data)
        ),
  })

  return (
    <Container className='gap-6 px-0'>
      <Select>
        <SelectTrigger className='mx-4'>
          <SelectValue placeholder='Select an option' />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>

            {Array.from({ length: 5 }).map((_, i) => (
              <SelectItem key={i} value={`option-${i}`}>
                Option {i + 1}
              </SelectItem>
            ))}
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>More options</SelectLabel>

            {Array.from({ length: 5 }).map((_, i) => (
              <SelectItem key={i} value={`more-option-${i}`}>
                More option {i + 1}
              </SelectItem>
            ))}
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Even more options</SelectLabel>

            {Array.from({ length: 5 }).map((_, i) => (
              <SelectItem key={i} value={`even-more-option-${i}`}>
                Even more option {i + 1}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <FlatList
        data={data}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item) => item.id}
        contentContainerClassName='px-4 gap-4 py-1'
        renderItem={({ item }) => (
          <Card>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {new Date(item.createdAt).toISOString()}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      />
    </Container>
  )
}
