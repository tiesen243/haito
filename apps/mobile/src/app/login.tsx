import { Button } from '@haito/ui/button'
import { Input } from '@haito/ui/input'
import { Typography } from '@haito/ui/typography'
import { View } from 'react-native'

import { Container } from '@/components/container'

export default function LoginScreen() {
  return (
    <Container className='gap-4 px-4' inTab={false}>
      <Typography variant='h1'>Login</Typography>

      <View className='gap-2'>
        <Typography>Email</Typography>
        <Input placeholder='haito@example.com' keyboardType='email-address' />
      </View>

      <View className='gap-2'>
        <Typography>Password</Typography>
        <Input secureTextEntry />
      </View>

      <Button>Login</Button>
    </Container>
  )
}
