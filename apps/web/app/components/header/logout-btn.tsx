import type { LogoutDto } from '@haito/api/dto/auth'

import { DropdownMenuItem } from '@haito/ui/dropdown-menu'
import { LogOutIcon } from '@haito/ui/icons'
import { toast } from '@haito/ui/toast'

import { useAuth } from '@/hooks/use-auth'
import { api } from '@/lib/api'

export const LogoutBtn: React.FC = () => {
  const { refetch } = useAuth()

  const handleLogout = async () => {
    const { success, message } =
      await api.post<LogoutDto.Output>('/auth/logout')

    if (!success) return toast.add({ type: 'error', description: message })

    toast.add({ type: 'success', description: 'Logout successful' })
    await refetch()
  }

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOutIcon /> Logout
    </DropdownMenuItem>
  )
}
