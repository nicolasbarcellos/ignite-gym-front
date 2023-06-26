import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import { Signin } from '@screens/Signin'
import { Signup } from '@screens/Signup'

type AuthRoutesProps = {
  signIn: undefined
  signUp: undefined
}

export type AuthNavigatorRoutesProps =
  NativeStackNavigationProp<AuthRoutesProps>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutesProps>()

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={Signin} />
      <Screen name="signUp" component={Signup} />
    </Navigator>
  )
}
