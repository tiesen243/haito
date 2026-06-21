import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { TouchableOpacity } from 'react-native'

import { buttonVariants } from '@/components/button'
import { Typography, TypographyContext } from '@/components/native/typography'
import { cn } from '@/utils'

interface ButtonProps
  extends
    React.ComponentProps<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {}

const buttonTextVariants = cva('text-sm font-medium whitespace-nowrap', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      destructive: 'text-destructive',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: '',
      xs: 'text-xs',
      sm: 'text-[0.8rem]',
      lg: '',
      icon: '',
      'icon-xs': '',
      'icon-sm': '',
      'icon-lg': '',
    },
  },
})

export function Button({
  className,
  variant = 'default',
  size = 'default',
  activeOpacity = 0.8,
  ...props
}: ButtonProps) {
  return (
    <TypographyContext value={cn(buttonTextVariants({ variant, size }))}>
      <TouchableOpacity
        data-slot='button'
        className={cn(buttonVariants({ variant, size }), className)}
        activeOpacity={activeOpacity}
        {...props}
      >
        {typeof props.children === 'string' ? (
          <Typography>{props.children}</Typography>
        ) : (
          props.children
        )}
      </TouchableOpacity>
    </TypographyContext>
  )
}
