import * as React from 'react'
import { Image, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface AvatarContextValue {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  isError: boolean
  setIsError: (isError: boolean) => void
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null)

function Avatar({ className, ...props }: React.ComponentProps<typeof View>) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isError, setIsError] = React.useState(false)

  const memoizedValue = React.useMemo(
    () => ({ isLoading, setIsLoading, isError, setIsError }),
    [isLoading, isError]
  )

  return (
    <AvatarContext value={memoizedValue}>
      <View
        data-slot='avatar'
        className={cn(
          'size-9 rounded-full relative flex shrink-0 items-center justify-between',
          className
        )}
        {...props}
      />
    </AvatarContext>
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof Image>) {
  const context = React.use(AvatarContext)
  if (!context) throw new Error('AvatarImage must be used within an Avatar')

  if (context.isError) return null

  return (
    <Image
      data-slot='avatar-image'
      className={cn('size-full absolute rounded-full aspect-square', className)}
      resizeMode='cover'
      onLoadStart={() => {
        context.setIsLoading(true)
        context.setIsError(false)
      }}
      onLoad={() => context.setIsLoading(false)}
      onError={() => {
        context.setIsLoading(false)
        context.setIsError(true)
      }}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  const context = React.use(AvatarContext)
  if (!context) throw new Error('AvatarFallback must be used within an Avatar')

  if (!context.isLoading && !context.isError) return null

  return (
    <View
      data-slot='avatar-fallback'
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-muted',
        className
      )}
      {...props}
    >
      <Text className='text-sm text-muted-foreground'>{children}</Text>
    </View>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
