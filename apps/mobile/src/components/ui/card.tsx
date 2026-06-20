import { View } from 'react-native'

import { Text, TextProvider } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface CardProps extends React.ComponentProps<typeof View> {}

interface CardTextProps extends Omit<
  React.ComponentProps<typeof Text>,
  'variant'
> {}

function Card({ className, ...props }: CardProps) {
  return (
    <TextProvider className='text-card-foreground text-sm'>
      <View
        data-slot='card'
        className={cn(
          'group/card bg-card border-foreground/10 flex flex-col gap-4 overflow-hidden rounded-xl border py-4',
          className
        )}
        {...props}
      />
    </TextProvider>
  )
}

function CardHeader({ className, ...props }: CardProps) {
  return (
    <View
      data-slot='card-header'
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: CardTextProps) {
  return (
    <Text
      data-slot='card-title'
      className={cn('text-base leading-snug font-medium', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: CardTextProps) {
  return (
    <Text
      data-slot='card-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: CardProps) {
  return (
    <View
      data-slot='card-content'
      className={cn('px-4', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: CardProps) {
  return (
    <View
      data-slot='card-footer'
      className={cn('flex flex-row items-center rounded-b-xl px-4', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
