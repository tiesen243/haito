import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable'
import { lazy } from 'react'

const Tabs = createNativeBottomTabNavigator({
  screens: {
    index: {
      screen: lazy(() => import('@/app/(tabs)/_index')),
      options: {
        title: 'Home',
        tabBarIcon: {
          type: 'image',
          source: require('@assets/icons/house.png'),
        },
      },
    },
    settings: {
      screen: lazy(() => import('@/app/(tabs)/settings')),
      options: {
        title: 'Settings',
        tabBarIcon: {
          type: 'image',
          source: require('@assets/icons/settings.png'),
        },
      },
    },
  },
})

export default Tabs
