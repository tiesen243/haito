import * as React from 'react'
import { View } from 'react-native'

import { Typography, TypographyContext } from '@/components/native/typography'
import { cn } from '@/utils'

const CardContext = React.createContext<{ size: 'default' | 'sm' }>({
  size: 'default',
})

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof View> & { size?: 'default' | 'sm' }) {
  return (
    <CardContext value={{ size }}>
      <TypographyContext value='text-card-foreground text-sm'>
        <View
          data-slot='card'
          className={cn(
            'group/card bg-card ring-foreground/10 flex flex-col overflow-hidden rounded-xl ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
            size === 'default' && 'gap-4 py-4',
            size === 'sm' && 'gap-3 py-3',
            className
          )}
          {...props}
        />
      </TypographyContext>
    </CardContext>
  )
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  const { size } = React.use(CardContext)

  return (
    <View
      data-slot='card-header'
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
        size === 'default' && 'px-4 [.border-b]:pb-4',
        size === 'sm' && 'px-3 [.border-b]:pb-3',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}: React.ComponentProps<typeof Typography>) {
  const { size } = React.use(CardContext)

  return (
    <Typography
      data-slot='card-title'
      className={cn(
        'leading-snug font-medium',
        size === 'default' && 'text-base',
        size === 'sm' && 'text-sm',
        className
      )}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      data-slot='card-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardAction({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot='card-action'
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  )
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  const { size } = React.use(CardContext)

  return (
    <View
      data-slot='card-content'
      className={cn(
        size === 'default' && 'px-4',
        size === 'sm' && 'px-3',
        className
      )}
      {...props}
    />
  )
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  const { size } = React.use(CardContext)

  return (
    <View
      data-slot='card-footer'
      className={cn(
        'bg-muted/50 flex items-center rounded-b-xl border-t',
        size === 'default' && 'p-4',
        size === 'sm' && 'p-3',
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
