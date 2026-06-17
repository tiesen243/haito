import type { Role, TextProps as RNTextProps } from 'react-native'

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { Platform, Text as RNText } from 'react-native'

import { cn } from '@/lib/utils'

type TextContextValue = { className?: string }

const TextContext = React.createContext<TextContextValue | null>(null)

function TextProvider({
  className,
  children,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  const memoizedValue = React.useMemo(() => ({ className }), [className])
  return <TextContext value={memoizedValue}>{children}</TextContext>
}

const textVariants = cva('text-base text-foreground', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
      h2: 'scroll-m-20 text-2xl font-bold tracking-tight text-balance',
      h3: 'scroll-m-20 text-xl font-semibold tracking-tight text-balance',
      h4: 'scroll-m-20 text-lg font-semibold tracking-tight text-balance',
      p: 'text-justify leading-7 text-pretty',
      small: 'block text-sm leading-none font-medium tracking-wide',
      blockquote: 'my-4 inline-block border-l-2 border-border pl-6 italic',
      code: 'relative w-fit rounded-sm border border-accent bg-accent/40 px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium text-accent-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

type TextVariant = NonNullable<VariantProps<typeof textVariants>['variant']>

const roles: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' }) as Role,
  code: Platform.select({ web: 'code' }) as Role,
}

const levels: Partial<Record<TextVariant, number>> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
}

export interface TextProps
  extends RNTextProps, VariantProps<typeof textVariants> {}

function Text({ variant, className, ...props }: TextProps) {
  const context = React.use(TextContext)

  return (
    <RNText
      data-slot='text'
      className={cn(textVariants({ variant }), context?.className, className)}
      role={variant ? roles[variant] : undefined}
      aria-level={variant ? levels[variant] : undefined}
      {...props}
    />
  )
}

export { TextProvider, Text }
