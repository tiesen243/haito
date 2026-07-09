import type { OneNoteDto } from '@haito/api/dto/note'

import { RenderMarkdown } from '@haito/ui/editor'
import { Typography } from '@haito/ui/typography'

import { NoteMenu } from '@/components/note-menu'

export const NoteContent: React.FC<{
  note: OneNoteDto.Output
  isOwner?: boolean
}> = ({ note, isOwner = false }) => (
  <article className='container py-4'>
    <div className='relative flex flex-col'>
      <Typography variant='h1'>{note.title || 'Untitled Note'}</Typography>
      <Typography className='text-muted-foreground'>
        {new Date(note.updatedAt).toDateString()}
      </Typography>

      {isOwner && <NoteMenu note={note} />}
    </div>

    <hr className='my-4' />

    <RenderMarkdown content={note.content} className='flex flex-col gap-1' />
  </article>
)

export const NoteContentSkeleton: React.FC = () => (
  <article className='container py-4'>
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

    <Typography className='flex animate-pulse flex-col gap-1'>
      <span className='bg-muted h-6 w-full rounded-sm' />
      <span className='bg-muted h-6 w-2/3 rounded-sm' />
      <span className='bg-muted h-6 w-3/4 rounded-sm' />
      <span className='bg-muted h-6 w-1/2 rounded-sm' />
    </Typography>
  </article>
)
