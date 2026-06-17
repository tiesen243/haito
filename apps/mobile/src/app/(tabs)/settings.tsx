import { View } from 'react-native'
import { useUniwind } from 'uniwind'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Text } from '@/components/ui/text'
import { setTheme } from '@/lib/theme'

export default function TabsSettingsScreen() {
  const { theme, hasAdaptiveThemes } = useUniwind()

  return (
    <View className='py-4 flex flex-col gap-4 bg-background'>
      <View className='px-4 flex flex-col gap-2'>
        <Text variant='h2'>Dark mode</Text>
        <RadioGroup
          value={hasAdaptiveThemes ? 'system' : theme}
          onValueChange={setTheme as never}
        >
          <RadioGroupItem value='light' label='Off' />
          <RadioGroupItem value='dark' label='On' />
          <RadioGroupItem value='system' label='Use device settings' />
        </RadioGroup>
      </View>
    </View>
  )
}
