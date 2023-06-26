import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { Exercise } from '@screens/Exercise'
import { History } from '@screens/History'
import { Home } from '@screens/Home'
import { Profile } from '@screens/Profile'

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import ProfileSvg from '@assets/profile.svg'

import { useTheme } from 'native-base'
import { Platform } from 'react-native'
import { RouteProp } from '@react-navigation/native'

type AppRoutesProps = {
  home: undefined
  history: undefined
  exercise: { exerciseID: string }
  profile: undefined
}

export type AppRoutesNavigatorProps = BottomTabNavigationProp<AppRoutesProps>
export type AppRoutesRouteProp = RouteProp<AppRoutesProps>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesProps>()

export function AppRoutes() {
  const { sizes, colors } = useTheme()

  const iconSize = sizes[6]

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[8],
          paddingTop: sizes[8],
        },
      }}
    >
      <Screen
        options={({ navigation }) => ({
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        })}
        name="home"
        component={Home}
      />
      <Screen
        options={({ navigation }) => ({
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        })}
        name="history"
        component={History}
      />
      <Screen
        options={({ navigation }) => ({
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        })}
        name="profile"
        component={Profile}
      />
      <Screen
        name="exercise"
        component={Exercise}
        options={{ tabBarButton: () => <></> }}
      />
    </Navigator>
  )
}
