import { Loading } from '@components/Loading'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { NativeBaseProvider } from 'native-base'
import customThemeType from './src/styles/theme'
import { Routes } from '@routes/index'
import { StatusBar } from 'react-native'
import { AuthProvider } from '@contexts/AuthContext'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={customThemeType}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      <AuthProvider>{fontsLoaded ? <Routes /> : <Loading />}</AuthProvider>
    </NativeBaseProvider>
  )
}
