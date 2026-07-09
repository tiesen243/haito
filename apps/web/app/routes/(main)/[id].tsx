import type { OneNoteDto } from '@haito/api/dto/note'

import { RenderMarkdown } from '@haito/ui/editor'
import { Typography } from '@haito/ui/typography'
import { useQuery } from '@tanstack/react-query'

import { NoteMenu } from '@/components/note-menu'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/lib/api'

import type { Route } from './+types/[id]'

export default function NoteDetailPage({ params }: Route.ComponentProps) {
  const { user } = useAuth()
  const { data: note, isLoading } = useQuery({
    queryKey: ['notes', params.id],
    queryFn: () =>
      api.get<OneNoteDto.Output>(`/notes/${params.id}`).then((res) => res.data),
  })

  if (isLoading || !note) return <NoteContentSkeleton />

  const isOwner = note.userId === user?.id
  if (!note.isPublic && !isOwner)
    return (
      <main className='container py-4'>
        <Typography variant='h1'>This note is private</Typography>
        <Typography className='text-muted-foreground'>
          You do not have permission to view this note.
        </Typography>
      </main>
    )

  return (
    <main className='container py-4'>
      <div className='relative flex flex-col gap-1'>
        <Typography variant='h1'>{note.title || 'Untitled Note'}</Typography>
        <Typography className='text-muted-foreground'>
          {new Date(note.updatedAt).toDateString()}
        </Typography>

        {isOwner && <NoteMenu note={note} />}
      </div>

      <hr className='my-4' />

      <RenderMarkdown content={note.content} className='flex flex-col gap-1' />
    </main>
  )
}

const NoteContentSkeleton: React.FC = () => (
  <main className='container py-4'>
    <div className='relative flex flex-col gap-1'>
      <Typography
        variant='h1'
        className='bg-muted w-1/2 animate-pulse rounded-sm'
      >
        &nbsp;
      </Typography>
      <Typography className='bg-muted w-1/4 animate-pulse rounded-sm'>
        &nbsp;
      </Typography>
    </div>

    <hr className='my-4' />

    <article className='flex flex-col gap-1'>
      {Array.from({ length: 5 }).map((_, index) => (
        <Typography
          key={index}
          className='bg-muted animate-pulse rounded-sm'
          style={{ width: `${Math.floor(Math.random() * 50) + 50}%` }}
        >
          &nbsp;
        </Typography>
      ))}
    </article>
  </main>
)
