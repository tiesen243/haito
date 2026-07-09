import { Card } from '@haito/ui/card'
import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <main className='grid min-h-dvh place-items-center px-4'>
      <Card className='w-full max-w-xl px-4'>
        <Outlet />
      </Card>
    </main>
  )
}
