import type { VariantProps } from 'class-variance-authority'
import type { Role } from 'react-native'

import { createContext, use } from 'react'
import { Text } from 'react-native'

import { typographyVariants } from '@/components/typography'
import { cn } from '@/utils'

interface TypographyProps
  extends
    React.ComponentProps<typeof Text>,
    VariantProps<typeof typographyVariants> {}

const ROLES = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  ul: 'list',
  ol: 'list',
} satisfies Record<string, Role>

const LEVELS = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
} satisfies Record<string, number>

const TypographyContext = createContext('')

function Typography({ className, variant = 'p', ...props }: TypographyProps) {
  const context = use(TypographyContext)

  return (
    <Text
      data-slot='typography'
      className={cn(typographyVariants({ variant }), context, className)}
      {...(variant && {
        role:
          variant in ROLES ? ROLES[variant as keyof typeof ROLES] : undefined,
        'aria-level':
          variant in LEVELS
            ? LEVELS[variant as keyof typeof LEVELS]
            : undefined,
      })}
      {...props}
    />
  )
}

export { TypographyContext, Typography, typographyVariants }
