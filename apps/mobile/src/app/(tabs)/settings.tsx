import { RadioGroup, RadioGroupItem } from '@haito/ui/radio-group'
import { Typography } from '@haito/ui/typography'
import { useUniwind } from 'uniwind'

import { Container } from '@/components/container'
import { setTheme } from '@/lib/theme'

export default function TabsSettingsScreen() {
  const { theme, hasAdaptiveThemes } = useUniwind()

  return (
    <Container inTab>
      <Typography variant='h2'>Dark mode</Typography>
      <RadioGroup
        defaultValue={hasAdaptiveThemes ? 'system' : theme}
        onValueChange={setTheme as never}
      >
        <RadioGroupItem value='light'>
          <Typography>Off</Typography>
        </RadioGroupItem>
        <RadioGroupItem value='dark'>
          <Typography>On</Typography>
        </RadioGroupItem>
        <RadioGroupItem value='system'>
          <Typography>Use device settings</Typography>
        </RadioGroupItem>
      </RadioGroup>
    </Container>
  )
}
