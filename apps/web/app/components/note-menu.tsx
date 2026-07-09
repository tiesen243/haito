import type { OneNoteDto } from '@haito/api/dto/note'

import { Button } from '@haito/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@haito/ui/dropdown-menu'
import {
  Ellipsis,
  GitBranchIcon,
  GitBranchMinusIcon,
  PencilIcon,
} from '@haito/ui/icons'
import { toast } from '@haito/ui/toast'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'

import { api } from '@/lib/api'

export const NoteMenu: React.FC<{ note: OneNoteDto.Output }> = ({ note }) => {
  const queryClient = useQueryClient()

  const toggleShare = async () => {
    const { success, message } = await api.patch(`/notes/update/${note.id}`, {
      isPublic: !note.isPublic,
    })
    if (!success) return toast.add({ type: 'error', description: message })
    toast.add({
      type: 'success',
      description: note.isPublic ? 'Note unshared' : 'Note shared',
    })
    await queryClient.invalidateQueries({ queryKey: ['notes'] })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant='outline'
            size='icon'
            className='absolute top-0 right-0'
          />
        }
      >
        <Ellipsis />
        <span className='sr-only'>Toggle Note Menu</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem render={<Link to={`/me/${note.id}/edit`} />}>
          <PencilIcon /> Edit Note
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toggleShare}>
          {note.isPublic ? (
            <>
              <GitBranchMinusIcon /> Unshare Note
            </>
          ) : (
            <>
              <GitBranchIcon /> Share Note
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
