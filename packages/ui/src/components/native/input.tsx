import * as React from 'react'
import { TextInput as InputPrimitive } from 'react-native'

import { cn } from '@/utils'

function Input({
  className,
  editable = true,
  placeholderTextColor: _,
  ...props
}: React.ComponentProps<typeof InputPrimitive> & {
  'aria-invalid'?: boolean
}) {
  return (
    <InputPrimitive
      data-slot='input'
      className={cn(
        'border-input dark:bg-input/30 text-foreground h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base outline-none md:text-sm',
        props['aria-invalid'] &&
          'border-destructive dark:border-destructive/50',
        !editable && 'bg-input/50 dark:bg-input/80 opacity-50',
        className
      )}
      placeholderTextColorClassName='text-muted-foreground'
      editable={editable}
      {...props}
    />
  )
}

export { Input }
