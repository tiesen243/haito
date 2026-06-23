import { cn } from '@haito/ui'
import { View } from 'react-native'

export function Container({
  className,
  inTab = false,
  ...props
}: React.ComponentProps<typeof View> & { inTab?: boolean }) {
  return (
    <View
      data-slot='container'
      className={cn(
        'bg-background container flex-1 gap-4 pt-4',
        inTab ? 'pb-24' : 'pb-4',
        className
      )}
      {...props}
    />
  )
}
