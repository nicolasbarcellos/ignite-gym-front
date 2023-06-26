import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import {
  Center,
  Heading,
  Image,
  Text,
  VStack,
  ScrollView,
  useToast,
} from 'native-base'
import React from 'react'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormDataSignUp, signUpSchema } from '../schemas/signUpSchema'
import { api } from '@services/api'

import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'

export function Signup() {
  const { signIn } = useAuth()
  const toast = useToast()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDataSignUp>({ resolver: yupResolver(signUpSchema) })

  function handleGoBack() {
    navigation.goBack()
  }

  const onSubmit: SubmitHandler<FormDataSignUp> = async ({
    email,
    name,
    password,
  }) => {
    // const response = await fetch('http://192.168.0.106:3333/users', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name,
    //     email,
    //     password,
    //   }),
    // })

    // const data = await response.json()
    // console.log(data)

    try {
      await api.post('users', { name, email, password })
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível criar a conta. Tenta novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
        top: 100,
      })
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
            Crie sua conta
          </Heading>

          <Controller
            name="name"
            control={control}
            // rules={{
            //   required: 'Preencha um nome',
            //   minLength: {
            //     value: 2,
            //     message: 'Entre com um nome de pelo menos 2 caracteres',
            //   },
            // }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            // rules={{
            //   required: 'Preencha um email',
            //   pattern: {
            //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            //     message: 'E-mail inválido',
            //   },
            // }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            // rules={{
            //   required: 'Preencha uma senha',
            //   minLength: {
            //     value: 6,
            //     message: 'Entre com no mínimo 6 caracteres',
            //   },
            // }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            name="passwordConfirm"
            control={control}
            // rules={{
            //   required: 'Preencha uma senha',
            //   validate: (val: string) => {
            //     if (watch('password') !== val) {
            //       return 'Senha não coincide'
            //     }
            //   },
            // }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme sua senha"
                secureTextEntry
                onSubmitEditing={handleSubmit(onSubmit)}
                returnKeyType="send"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.passwordConfirm?.message}
              />
            )}
          />

          <Button
            _loading={{ fontFamily: 'heading', fontSize: 'sm' }}
            isLoading={isSubmitting}
            isLoadingText="Criando a conta"
            title="Criar e acessar"
            onPress={handleSubmit(onSubmit)}
          />
        </Center>

        <Button
          onPress={handleGoBack}
          mt={12}
          title="Voltar para login"
          variant={'outline'}
        />
      </VStack>
    </ScrollView>
  )
}
