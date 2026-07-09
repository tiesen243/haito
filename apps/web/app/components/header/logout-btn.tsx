import type { LogoutDto } from '@haito/api/dto/auth'

import { DropdownMenuItem } from '@haito/ui/dropdown-menu'
import { LogOutIcon } from '@haito/ui/icons'
import { toast } from '@haito/ui/toast'
import { useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

export const LogoutBtn: React.FC = () => {
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    const { success, message } =
      await api.post<LogoutDto.Output>('/auth/logout')

    if (!success) return toast.add({ type: 'error', description: message })

    toast.add({ type: 'success', description: 'Logout successful' })
    queryClient.setQueriesData({ queryKey: ['auth', 'whoami'] }, null)
  }

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOutIcon /> Logout
    </DropdownMenuItem>
  )
}
