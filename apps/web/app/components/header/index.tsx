import { Link } from 'react-router'

import { User } from '@/components/header/user'
import { APP_NAME } from '@/lib/contants'

export const Header: React.FC = () => (
  <header className='bg-popover text-popover-foreground flex h-14 items-center border-b'>
    <div className='container flex items-center justify-between gap-4'>
      <Link to='/' className='flex items-center gap-2'>
        <img src='/icon-512.png' alt='Logo' className='size-8 object-cover' />
        <span className='text-lg font-bold'>{APP_NAME}</span>
      </Link>

      <User />
    </div>
  </header>
)
