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
    <TextProvider className='text-sm text-card-foreground'>
      <View
        data-slot='card'
        className={cn(
          'group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 border border-foreground/10',
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
      className={cn('text-sm text-muted-foreground', className)}
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
      className={cn('flex flex-row px-4 items-center rounded-b-xl', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
