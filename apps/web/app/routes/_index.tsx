import type { GetPostsDto } from '@haito/api/dtos/post'

import { CreatePostDto } from '@haito/api/dtos/post'
import { Button } from '@haito/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@haito/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '@haito/ui/field'
import { useForm } from '@haito/ui/hooks/use-form'
import { XIcon } from '@haito/ui/icons'
import { Input } from '@haito/ui/input'
import { toast } from '@haito/ui/toast'
import { Typography } from '@haito/ui/typography'
import { useMutation, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

const QUERY_KEY = ['posts'] as const

export default function Index() {
  return (
    <main className='container flex flex-col gap-4 py-4'>
      <Typography variant='h1'>Welcome to Haito!</Typography>

      <CreatePostForm />

      <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Typography variant='h2' className='col-span-full'>
          Posts
        </Typography>

        <PostList />
      </section>
    </main>
  )
}

const CreatePostForm: React.FC = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (values: CreatePostDto.Input) => {
      const { success, message, data } = await api.post<CreatePostDto.Output>(
        '/posts',
        values
      )
      if (!success) throw new Error(message)
      return data
    },
    meta: { filter: { queryKey: QUERY_KEY } },
  })

  const form = useForm({
    defaultValues: { title: '', content: '' },
    schema: CreatePostDto.input,
    onSubmit: mutateAsync,
    onSuccess: () =>
      toast.add({ type: 'success', title: 'Post created successfully!' }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to create post',
        description: message,
      }),
  })

  return (
    <form id={form.formId} onSubmit={form.handleSubmit}>
      <FieldSet className='bg-card text-card-foreground rounded-lg border p-4'>
        <FieldTitle>Create Post</FieldTitle>

        <FieldGroup>
          <form.Field
            name='title'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Title</FieldLabel>
                <Input {...field} placeholder="What's on your mind?" />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Creating...' : 'Create Post'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

const PostList: React.FC = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<GetPostsDto.Output>('/posts')
      return data?.posts ?? []
    },
  })

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { success, message } = await api.delete(`/posts/${id}`)
      if (!success) throw new Error(message)
    },
    meta: { filter: { queryKey: QUERY_KEY } },
    onSuccess: () =>
      toast.add({ type: 'success', title: 'Post deleted successfully!' }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to delete post',
        description: message,
      }),
  })

  if (isLoading)
    return Array.from({ length: 3 }, (_, i) => (
      <Card key={i} className='animate-pulse'>
        <CardHeader>
          <CardTitle className='bg-muted w-1/2 rounded-md'>&nbsp;</CardTitle>
          <CardDescription className='bg-muted w-1/4 rounded-md'>
            &nbsp;
          </CardDescription>
        </CardHeader>
      </Card>
    ))

  return posts?.map((post) => (
    <Card key={post.id}>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          {`Created at ${new Date(post.createdAt).toLocaleString()}`}
        </CardDescription>
        <CardAction>
          <Button
            variant='ghost'
            size='icon-xs'
            onClick={() => deletePost(post.id)}
            disabled={isDeleting}
          >
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  ))
}
