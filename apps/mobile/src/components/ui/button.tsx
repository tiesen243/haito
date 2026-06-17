import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { TouchableOpacity } from 'react-native'

import { Text, TextProvider } from '@/components/ui/text'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        outline:
          'border-border bg-background dark:border-input dark:bg-input/30',
        secondary: 'bg-secondary',
        ghost: '',
        destructive: 'bg-destructive/10 dark:bg-destructive/20',
        link: '',
      },
      size: {
        default: 'h-8 gap-1.5 px-2.5',
        xs: 'h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2',
        sm: 'h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5',
        lg: 'h-9 gap-1.5 px-2.5',
        icon: 'size-8',
        'icon-xs': 'size-6 rounded-[min(var(--radius-md),10px)]',
        'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)]',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

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
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: React.ComponentProps<typeof TouchableOpacity> &
  VariantProps<typeof buttonVariants>) {
  return (
    <TextProvider className={cn(buttonTextVariants({ variant, size }))}>
      <TouchableOpacity
        data-slot='button'
        activeOpacity={0.8}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {typeof props.children === 'string' ? (
          <Text>{props.children}</Text>
        ) : (
          props.children
        )}
      </TouchableOpacity>
    </TextProvider>
  )
}

export { Button }
