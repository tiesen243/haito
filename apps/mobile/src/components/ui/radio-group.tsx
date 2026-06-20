import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface RadioContextValue {
  value: string
  onValueChange: (value: string) => void
}

const RadioContext = React.createContext<RadioContextValue | null>(null)

interface RadioGroupProps
  extends React.ComponentProps<typeof View>, RadioContextValue {}

function RadioGroup({
  value,
  onValueChange,
  className,
  ...props
}: RadioGroupProps) {
  const memoizedContextValue = React.useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange]
  )

  return (
    <RadioContext value={memoizedContextValue}>
      <View
        data-slot='radio-group'
        className={cn('flex flex-col gap-2', className)}
        {...props}
      />
    </RadioContext>
  )
}

interface RadioGroupItemProps extends React.ComponentProps<
  typeof TouchableOpacity
> {
  value: string
  label?: string
}

function RadioGroupItem({
  value,
  label,
  className,
  ...props
}: RadioGroupItemProps) {
  const context = React.use(RadioContext)
  if (!context)
    throw new Error('RadioGroupItem must be used within a RadioGroup')

  const isSelected = context.value === value

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => context.onValueChange(value)}
      className={cn('flex flex-row items-center gap-2', className)}
      {...props}
    >
      <View
        className={cn(
          'border-border m-0 flex size-5 items-center justify-center rounded-full border p-0',
          isSelected ? 'bg-primary' : 'bg-card'
        )}
      >
        <View
          className={cn(
            'm-0 size-2 rounded-full p-0',
            isSelected ? 'bg-primary-foreground' : 'bg-card'
          )}
        />
      </View>

      <Text>{label ?? value}</Text>
    </TouchableOpacity>
  )
}

export { RadioGroup, RadioGroupItem }
