import { useNavigation } from '@react-navigation/native'
import {
  Center,
  Heading,
  Image,
  Text,
  VStack,
  ScrollView,
  useToast,
} from 'native-base'
import React, { useState } from 'react'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FormDataSignIn, SignInSchema } from '../schemas/signInSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'

export function Signin() {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const toast = useToast()
  const { signIn } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataSignIn>({ resolver: yupResolver(SignInSchema) })

  const handleNewAccount = () => {
    navigation.navigate('signUp')
  }

  const onSubmit: SubmitHandler<FormDataSignIn> = async ({
    email,
    password,
  }) => {
    try {
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível acessar sua conta. Tente novamente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
        top: 130,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator
    >
      <VStack flex={1} px={'10'} pb={'16'}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Duas pessoas na bicicleta"
          resizeMode="contain"
          position={'absolute'}
        />
        <Center my={'24'}>
          <LogoSvg />

          <Text fontFamily={'body'} color={'gray.100'} fontSize={'sm'}>
            Treine sua mente e seu corpo
          </Text>
        </Center>

        <Center>
          <Heading
            color={'gray.100'}
            fontSize={'xl'}
            mb={'6'}
            fontFamily="heading"
          >
            Acesse sua conta
          </Heading>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="Senha"
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            _loading={{ fontFamily: 'heading', fontSize: 'sm' }}
            isLoading={isLoading}
            isLoadingText="Acessando"
            title="Acessar"
            onPress={handleSubmit(onSubmit)}
          />
        </Center>

        <Center mt={24}>
          <Text color={'gray.100'} fontSize={'sm'} mb={3} fontFamily={'body'}>
            Ainda não tenho acesso?
          </Text>
          <Button
            onPress={handleNewAccount}
            title="Criar conta"
            variant={'outline'}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
