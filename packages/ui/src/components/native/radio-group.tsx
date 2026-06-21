import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { TypographyContext } from '@/components/native/typography'
import { cn } from '@/utils'

interface RadioGroupContextValue {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
)

function RadioGroup({
  defaultValue,
  onValueChange,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View> & {
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  const [value, setValue] = React.useState(defaultValue ?? '')

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setValue(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange]
  )

  const memoizedValue = React.useMemo(
    () => ({ value, onValueChange: handleValueChange }),
    [value, handleValueChange]
  )

  return (
    <RadioGroupContext value={memoizedValue}>
      <TypographyContext value='my-0 p-0 leading-none'>
        <View
          data-slot='radio-group'
          className={cn('grid w-full gap-2', className)}
          {...props}
        />
      </TypographyContext>
    </RadioGroupContext>
  )
}

function RadioGroupItem({
  value,
  className,
  activeOpacity = 0.8,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TouchableOpacity> & {
  value: string
}) {
  const context = React.use(RadioGroupContext)
  if (!context)
    throw new Error('RadioGroupItem must be used within a RadioGroup')

  return (
    <TouchableOpacity
      data-slot='radio-group-item'
      className={cn(
        'group/radio-group-item flex flex-row items-start justify-start gap-3',
        props.disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      activeOpacity={activeOpacity}
      onPress={() => context.onValueChange(value)}
      {...props}
    >
      <View
        data-slot='radio-group-indicator'
        className={cn(
          'border-input dark:bg-input/30 relative flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border outline-none',
          context.value === value && 'border-primary bg-primary dark:bg-primary'
        )}
      >
        <View
          className={cn(
            'absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full',
            context.value === value && 'bg-primary-foreground'
          )}
        />
      </View>

      {children}
    </TouchableOpacity>
  )
}

export { RadioGroup, RadioGroupItem }
