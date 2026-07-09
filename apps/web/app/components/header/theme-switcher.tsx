import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from '@haito/ui/dropdown-menu'
import {
  SunMoonIcon,
  SunIcon,
  MoonIcon,
  LaptopIcon,
  CheckIcon,
} from '@haito/ui/icons'
import { useTheme } from 'next-themes'

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoonIcon /> Appearance
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className='w-40'>
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <SunIcon /> Light{' '}
            {theme === 'light' && <CheckIcon className='ml-auto' />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <MoonIcon /> Dark{' '}
            {theme === 'dark' && <CheckIcon className='ml-auto' />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <LaptopIcon /> System{' '}
            {theme === 'system' && <CheckIcon className='ml-auto' />}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
