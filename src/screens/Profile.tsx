import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from 'native-base'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormDataProfile, profileSchema } from '../schemas/profileSchema'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import userAvatarDefault from '@assets/userPhotoDefault.png'

export function Profile() {
  const [isLoaded, setIsLoaded] = useState(false)
  const toast = useToast()

  const { user, updateUserProfile } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDataProfile>({
    resolver: yupResolver(profileSchema),
  })

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoUri = photoSelected.assets[0].uri
        const photoInfo = await FileSystem.getInfoAsync(photoUri)

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 2) {
          return toast.show({
            description: 'Selecione uma imagem de até 5mb',
            placement: 'top',
            bgColor: 'red.500',
            top: 10,
            duration: 3000,
          })
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch(
          'users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada',
          placement: 'top',
          bgColor: 'green.500',
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit: SubmitHandler<FormDataProfile> = async (data) => {
    try {
      const userUpdated = user
      userUpdated.name = data.name

      await api.put('users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil atualizado',
        placement: 'top',
        bgColor: 'green.500',
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar dados'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView flex={1}>
        <Center px={6} mt={6} pb={8}>
          <Skeleton
            isLoaded={isLoaded}
            w={33}
            h={33}
            rounded={'full'}
            startColor="gray.400"
            endColor="gray.900"
          />

          <UserPhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}avatar/${user.avatar}` }
                : userAvatarDefault
            }
            alt="Foto do usuário"
            size={33}
            onLoadEnd={() => setIsLoaded(true)}
            display={isLoaded ? 'flex' : 'none'}
          />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color={'green.500'} fontWeight={'bold'} mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            name="name"
            control={control}
            defaultValue={user.name}
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="Nome"
                bg={'gray.600'}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            defaultValue={user.email}
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                isReadOnly
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Heading
            alignSelf={'flex-start'}
            mt={12}
            color={'gray.200'}
            fontSize={'md'}
            mb={2}
            fontFamily={'heading'}
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                bg={'gray.600'}
                placeholder="Nova senha"
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            name="confirm_password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                bg={'gray.600'}
                placeholder="Confirme a nova senha"
                secureTextEntry
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            isLoading={isSubmitting}
            isLoadingText="Atualizando"
            _loading={{ fontFamily: 'heading', fontSize: 'sm' }}
            onPress={handleSubmit(onSubmit)}
            title="Atualizar"
            mt={4}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
