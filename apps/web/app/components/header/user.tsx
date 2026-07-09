import { Avatar, AvatarFallback, AvatarImage } from '@haito/ui/avatar'
import { Button } from '@haito/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@haito/ui/dropdown-menu'
import { StickyNoteIcon, StickyNotePlusIcon, TrashIcon } from '@haito/ui/icons'
import { Link } from 'react-router'

import { LogoutBtn } from '@/components/header/logout-btn'
import { ThemeSwitcher } from '@/components/header/theme-switcher'
import { useAuth } from '@/hooks/use-auth'

export const User: React.FC = () => {
  const { user, status } = useAuth()

  if (status === 'pending') return <Avatar className='bg-muted animate-pulse' />

  if (!user)
    return (
      <Button nativeButton={false} render={<Link to='/login' />}>
        Login
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image ?? ''} />
          <AvatarFallback>
            {user?.username[0]?.toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='flex flex-col gap-1'>
            <span>{user?.username}</span>
            <span>{user?.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link to='/me' />}>
            <StickyNoteIcon /> My Notes
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to='/me/create' />}>
            <StickyNotePlusIcon /> Create Note
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to='/me/trash' />}>
            <TrashIcon /> Trash
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <ThemeSwitcher />

          <LogoutBtn />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
