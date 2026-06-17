import { View } from 'react-native'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Text } from '@/components/ui/text'

export default function TabsIndexScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <Card>
        <CardHeader className='flex flex-row items-center gap-2'>
          <Avatar>
            <AvatarImage source={{ uri: 'https://github.com/tiesen243.png' }} />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>

          <View className='space-y-1'>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>
              This is a description of the card.
            </CardDescription>
          </View>
        </CardHeader>

        <CardContent>
          <Text>This is the content of the card.</Text>
          <Text>You can put any content you want here.</Text>
        </CardContent>
        <CardFooter className='justify-end'>
          <Button>Action</Button>
        </CardFooter>
      </Card>
    </View>
  )
}
