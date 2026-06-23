import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { useMemo } from 'react'
import { View } from 'react-native'

import { Label } from '@/components/native/label'
import { Separator } from '@/components/native/separator'
import { Typography, TypographyContext } from '@/components/native/typography'
import { cn } from '@/utils'

function FieldSet({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot='field-set'
      className={cn(
        'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: Omit<React.ComponentProps<typeof Typography>, 'variant'> & {
  variant?: 'legend' | 'label'
}) {
  return (
    <Typography
      data-slot='field-legend'
      data-variant={variant}
      className={cn(
        'mb-1.5 leading-none font-medium',
        variant === 'legend' && 'text-base',
        variant === 'label' && 'text-sm',
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot='field-group'
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  'group/field data-[invalid=true]:text-destructive flex w-full gap-2',
  {
    variants: {
      orientation: {
        vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
        horizontal:
          'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        responsive:
          'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
)

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof View> &
  VariantProps<typeof fieldVariants> & {
    'data-invalid'?: boolean
  }) {
  return (
    <TypographyContext value={props['data-invalid'] ? 'text-destructive' : ''}>
      <View
        role='group'
        data-slot='field'
        data-orientation={orientation}
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      />
    </TypographyContext>
  )
}

function FieldContent({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot='field-content'
      className={cn(
        'group/field-content flex flex-1 flex-col gap-0.5 leading-snug',
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot='field-label'
      className={cn(
        'group/field-label peer/field-label has-data-checked:border-primary/30 has-data-checked:bg-primary/5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({
  className,
  ...props
}: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      data-slot='field-title'
      className={cn(
        'flex w-fit items-center gap-2 text-sm leading-0 font-medium group-data-[disabled=true]/field:opacity-50',
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      data-slot='field-description'
      className={cn(
        'text-muted-foreground text-left text-sm leading-normal font-normal group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
        'last:mt-0 nth-last-2:-mt-1',
        '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof View> & {
  children?: React.ReactNode
}) {
  return (
    <View
      data-slot='field-separator'
      data-content={!!children}
      className={cn(
        'relative -my-2 h-5 group-data-[variant=outline]/field-group:-mb-2',
        className
      )}
      {...props}
    >
      <Separator className='absolute inset-0 top-1/2' />
      {children && (
        <Typography
          className='bg-background text-muted-foreground relative mx-auto block w-fit px-2 text-sm leading-none'
          data-slot='field-separator-content'
        >
          {children}
        </Typography>
      )}
    </View>
  )
}

function FieldError({
  children,
  errors,
  ...props
}: React.ComponentProps<typeof View> & {
  errors?: ({ message?: string } | undefined)[]
}) {
  const content = useMemo(() => {
    if (children) return children

    if (!errors?.length) return null

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length === 1)
      return <Typography>{uniqueErrors[0]?.message}</Typography>

    return (
      <View className='ml-4 flex list-disc flex-col gap-1'>
        {uniqueErrors.map(
          (error, index) =>
            error?.message && (
              <Typography key={index}>{error.message}</Typography>
            )
        )}
      </View>
    )
  }, [children, errors])

  if (!content) return null

  return (
    <TypographyContext value='text-destructive leading-none text-sm font-normal'>
      <View role='alert' data-slot='field-error' {...props}>
        {content}
      </View>
    </TypographyContext>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
