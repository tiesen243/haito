import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import * as React from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@/components/native/icons'
import { Typography } from '@/components/native/typography'
import { cn } from '@/utils'

interface SelectContextValue {
  open: boolean
  onOpenChange: (_open: SelectContextValue['open']) => void
  value: string
  onValueChange: (_value: SelectContextValue['value']) => void
  selectedValueLabel: string
  setSelectedValueLabel: React.Dispatch<
    React.SetStateAction<SelectContextValue['selectedValueLabel']>
  >
  showScrollButton: 'up' | 'down' | null
  setShowScrollButton: React.Dispatch<
    React.SetStateAction<SelectContextValue['showScrollButton']>
  >
  scrollViewRef: React.RefObject<ScrollView | null>
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelect() {
  const context = React.use(SelectContext)
  if (!context)
    throw new Error('useSelect must be used within a Select component')
  return context
}

type SelectProps = Partial<
  Omit<SelectContextValue, 'selectedValueLabel' | 'setSelectedValueLabel'>
> & {
  children: React.ReactNode
}

function Select({ children, ...props }: SelectProps) {
  const [open, setOpen] = React.useState(props.open ?? false)
  const [value, setValue] = React.useState(props.value ?? '')
  const [selectedValueLabel, setSelectedValueLabel] = React.useState('')
  const [showScrollButton, setShowScrollButton] =
    React.useState<SelectContextValue['showScrollButton']>(null)
  const scrollViewRef = React.useRef<ScrollView>(null)

  const handleOpenChange = React.useCallback(
    (_open: boolean) => {
      setOpen(_open)
      if (props.onOpenChange) props.onOpenChange(_open)
    },
    [props]
  )

  const handleValueChange = React.useCallback(
    (_value: string) => {
      setValue(_value)
      if (props.onValueChange) props.onValueChange(_value)
    },
    [props]
  )

  const memoizedValue = React.useMemo(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      value,
      onValueChange: handleValueChange,
      selectedValueLabel,
      setSelectedValueLabel,
      showScrollButton,
      setShowScrollButton,
      scrollViewRef,
    }),
    [
      open,
      handleOpenChange,
      value,
      handleValueChange,
      selectedValueLabel,
      setSelectedValueLabel,
      showScrollButton,
      setShowScrollButton,
    ]
  )

  return <SelectContext value={memoizedValue}>{children}</SelectContext>
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot='select-group'
      className={cn('w-full gap-0.5', className)}
      {...props}
    />
  )
}

function SelectValue({
  placeholder = 'Select an option',
  className,
  ...props
}: React.ComponentProps<typeof Typography> & {
  placeholder?: string
}) {
  const { selectedValueLabel } = useSelect()

  return (
    <Typography
      data-slot='select-value'
      className={cn(
        'flex flex-1 text-left text-xs',
        !selectedValueLabel && 'text-muted-foreground',
        className
      )}
      {...props}
    >
      {selectedValueLabel || placeholder}
    </Typography>
  )
}

function SelectTrigger({
  className,
  size = 'default',
  activeOpacity = 0.5,
  children,
  ...props
}: React.ComponentProps<typeof TouchableOpacity> & {
  size?: 'sm' | 'default'
}) {
  const { open, onOpenChange } = useSelect()

  return (
    <TouchableOpacity
      data-slot='select-trigger'
      className={cn(
        'border-input dark:bg-input/30 flex w-fit flex-row items-center justify-between gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 outline-none',
        size === 'default' ? 'h-8' : 'h-7 rounded-[min(var(--radius-md),10px)]',
        props.disabled && 'opacity-50',
        className
      )}
      activeOpacity={activeOpacity}
      onPress={() => onOpenChange(!open)}
      {...props}
    >
      {children}

      <ChevronDownIcon color='#a1a1a1' size={16} />
    </TouchableOpacity>
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  const { open, onOpenChange, setShowScrollButton, scrollViewRef } = useSelect()

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent

      if (contentOffset.y <= 0) setShowScrollButton('down')
      else if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - 20
      )
        setShowScrollButton('up')
    },
    [setShowScrollButton]
  )

  return (
    <Modal
      animationType='fade'
      visible={open}
      onRequestClose={() => onOpenChange(false)}
      transparent
    >
      <Pressable
        className='bg-background/40 flex-1 items-center justify-center p-4'
        onPress={() => onOpenChange(false)}
      >
        <View
          data-slot='select-content'
          className={cn(
            'bg-popover ring-foreground/10 relative isolate z-50 h-fit max-h-[70%] w-full min-w-36 overflow-x-hidden overflow-y-auto rounded-lg shadow-md ring-1',
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <ScrollView
            ref={scrollViewRef}
            contentContainerClassName='gap-1 p-3'
            onScroll={handleScroll}
          >
            {children}
          </ScrollView>
          <SelectScrollDownButton />
        </View>
      </Pressable>
    </Modal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      data-slot='select-label'
      className={cn('text-muted-foreground px-1.5 py-1 text-xs', className)}
      {...props}
    />
  )
}

function SelectItem({
  value,
  className,
  activeOpacity = 0.8,
  ...props
}: React.ComponentProps<typeof TouchableOpacity> & { value: string }) {
  const {
    value: rootValue,
    onValueChange,
    onOpenChange,
    setSelectedValueLabel,
  } = useSelect()
  const isSelected = React.useMemo(
    () => rootValue === value,
    [rootValue, value]
  )

  return (
    <TouchableOpacity
      data-slot='select-item'
      className={cn(
        'relative my-0.5 flex w-full flex-row items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none',
        isSelected && 'bg-accent',
        props.disabled && 'opacity-50',
        className
      )}
      activeOpacity={activeOpacity}
      onPress={() => {
        onValueChange(value)
        onOpenChange(false)
        setSelectedValueLabel(props.children as string)
      }}
      {...props}
    >
      <Typography
        className={cn(
          'flex flex-1 shrink-0 gap-2 whitespace-nowrap',
          isSelected && 'text-accent-foreground'
        )}
      >
        {props.children}
      </Typography>

      {isSelected && <CheckIcon color={'#a1a1a1'} size={16} />}
    </TouchableOpacity>
  )
}

function SelectSeparator() {
  return <View />
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const { showScrollButton, scrollViewRef } = useSelect()
  if (showScrollButton !== 'up') return null

  return (
    <Pressable
      data-slot='select-scroll-up-button'
      className={cn(
        'bg-popover top-0 z-10 flex w-full cursor-default items-center justify-center py-1',
        className
      )}
      onPress={() => {
        if (scrollViewRef.current)
          scrollViewRef.current.scrollTo({ y: 0, animated: true })
      }}
      {...props}
    >
      <ChevronUpIcon color='#a1a1a1' size={16} />
    </Pressable>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const { showScrollButton, scrollViewRef } = useSelect()
  if (showScrollButton !== 'down') return null

  return (
    <Pressable
      data-slot='select-scroll-down-button'
      className={cn(
        'bg-popover bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1',
        className
      )}
      onPress={() => {
        if (scrollViewRef.current)
          scrollViewRef.current.scrollToEnd({ animated: true })
      }}
      {...props}
    >
      <ChevronDownIcon color='#a1a1a1' size={16} />
    </Pressable>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
