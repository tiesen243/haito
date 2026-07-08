import type { ListPostsModel } from '@haito/validators/models/post'

import { Button } from '@haito/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@haito/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@haito/ui/field'
import { useForm } from '@haito/ui/hooks/use-form'
import { XIcon } from '@haito/ui/icons'
import { Input } from '@haito/ui/input'
import { Typography } from '@haito/ui/typography'
import { CreatePostModel } from '@haito/validators/models/post'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ActivityIndicator, FlatList } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { Container } from '@/components/container'
import { api } from '@/lib/api'

const QUERY_KEY = ['posts'] as const

export default function TabsIndexScreen() {
  return (
    <Container inTab>
      <Typography variant='h1'>Welcome to Haito!</Typography>

      <CreatePostForm />

      <Typography variant='h2' className='col-span-full'>
        Posts
      </Typography>

      <PostList />
    </Container>
  )
}

const CreatePostForm: React.FC = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (values: CreatePostModel.Input) => {
      const { success, message, data } = await api.post<CreatePostModel.Output>(
        '/posts',
        values
      )
      if (!success) throw new Error(message)
      return data
    },
    meta: { filter: { queryKey: QUERY_KEY } },
  })

  const form = useForm({
    defaultValues: { title: '' },
    schema: CreatePostModel.input,
    onSubmit: mutateAsync,
  })

  return (
    <FieldSet className='bg-card text-card-foreground border-border rounded-lg border p-4'>
      <FieldLegend>Create Post</FieldLegend>

      <FieldGroup>
        <form.Field
          name='title'
          render={({ field: { onChange, ...field }, meta }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel>Title</FieldLabel>
              <Input
                placeholder="What's on your mind?"
                onChangeText={onChange}
                {...field}
              />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <Field>
          <Button
            onPress={() => form.handleSubmit()}
            disabled={form.state.isPending}
          >
            {form.state.isPending ? 'Creating...' : 'Create Post'}
          </Button>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

const PostList: React.FC = () => {
  const foregroundColor = useCSSVariable('--color-foreground')

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data: posts = [] } =
        await api.get<ListPostsModel.Output>('/posts')
      return posts
    },
  })

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { success, message } = await api.delete(`/posts/${id}`)
      if (!success) throw new Error(message)
    },
    meta: { filter: { queryKey: QUERY_KEY } },
  })

  if (isLoading) return <ActivityIndicator size='large' />

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(item) => item.id}
      onRefresh={refetch}
      refreshing={isRefetching}
      className='-mx-4'
      contentContainerClassName='gap-4 px-4 py-0.5'
      renderItem={({ item }) => (
        <Card>
          <CardHeader
            action={
              <Button
                variant='ghost'
                size='icon-xs'
                onPress={() => deletePost(item.id)}
                disabled={isDeleting}
              >
                <XIcon size={16} color={String(foregroundColor ?? 'white')} />
              </Button>
            }
          >
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>
              {`Created at ${new Date(item.createdAt).toLocaleString()}`}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    />
  )
}
