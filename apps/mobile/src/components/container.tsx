import { cn } from '@haito/ui'
import { View } from 'react-native'

export function Container({
  className,
  inTab = true,
  ...props
}: React.ComponentProps<typeof View> & { inTab?: boolean }) {
  return (
    <View
      data-slot='container'
      className={cn('flex-1 px-0 pt-4', inTab ? 'pb-24' : 'pb-4', className)}
      {...props}
    />
  )
}
