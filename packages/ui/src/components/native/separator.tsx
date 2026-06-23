import { View } from 'react-native'

import { cn } from '@/utils'

function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof View> & {
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <View
      data-slot='separator'
      className={cn(
        'bg-border shrink-0',
        {
          'h-px w-full': orientation === 'horizontal',
          'w-px self-stretch': orientation === 'vertical',
        },
        className
      )}
      {...props}
    />
  )
}

export { Separator }
