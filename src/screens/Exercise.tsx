import { useNavigation, useRoute } from '@react-navigation/native'
import { AppRoutesNavigatorProps, AppRoutesRouteProp } from '@routes/app.routes'
import {
  Box,
  HStack,
  Heading,
  Icon,
  Image,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from 'native-base'

import { Feather } from '@expo/vector-icons'
import BodyIcon from '@assets/body.svg'
import SeriesIcon from '@assets/series.svg'
import RepetitionIcon from '@assets/repetitions.svg'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Button } from '@components/Button'
import { api } from '@services/api'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { AppError } from '@utils/AppError'

export function Exercise() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const { params } = useRoute<AppRoutesRouteProp>()
  const exerciseID = params?.exerciseID

  const toast = useToast()

  const navigation = useNavigation<AppRoutesNavigatorProps>()

  function handleGoBack() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      const { data } = await api.get(`exercises/${exerciseID}`)
      setExercise(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes do exercício'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoaded(true)
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      await api.post('history', { exercise_id: exerciseID })
      toast.show({
        title: 'Exercício registrado com sucesso no seu histórico',
        placement: 'top',
        bgColor: 'green.700',
        onCloseComplete: () => navigation.navigate('history'),
        duration: 1000,
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível registrar o exercício'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
        duration: 1500,
      })
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [])

  return (
    <VStack flex={1}>
      <HStack
        bg={'gray.600'}
        p={8}
        pt={12}
        position={'relative'}
        alignItems={'center'}
      >
        <TouchableOpacity style={{ position: 'absolute', left: 32, top: 40 }}>
          <Icon
            onPress={handleGoBack}
            as={Feather}
            name="arrow-left"
            color={'green.500'}
            size={6}
          />
        </TouchableOpacity>

        <Heading
          mt={8}
          mr={3}
          fontSize={'xl'}
          color={'gray.100'}
          flex={1}
          flexShrink={1}
          fontFamily={'heading'}
        >
          {exercise?.name}
        </Heading>

        <HStack mt={8} alignItems={'center'} space={1}>
          <BodyIcon />
          <Text textTransform={'capitalize'} fontSize={'md'} color={'gray.200'}>
            {exercise?.group}
          </Text>
        </HStack>
      </HStack>
      <ScrollView flex={1}>
        <VStack px={8} mt={8} pb={10} flex={1}>
          <Skeleton
            h={320}
            rounded={'lg'}
            mb={3}
            startColor="gray.400"
            endColor="gray.900"
            isLoaded={isLoaded}
          >
            <Box overflow={'hidden'} rounded={'lg'} mb={3}>
              <Image
                resizeMode="cover"
                w={'full'}
                h={320}
                source={{
                  uri: `${api.defaults.baseURL}exercise/demo/${exercise?.demo}`,
                }}
                alt="Pessoa fazendo exercício"
              />
            </Box>
          </Skeleton>

          <Skeleton
            bg={'gray.800'}
            rounded={'lg'}
            h={'145px'}
            startColor="gray.400"
            endColor="gray.900"
            isLoaded={isLoaded}
          >
            <VStack bg={'gray.800'} rounded={'lg'} p={4} pt={5}>
              <HStack justifyContent={'space-around'}>
                <HStack alignItems={'center'} space={2}>
                  <SeriesIcon />
                  <Text fontSize={'md'} color={'gray.200'}>
                    {exercise?.series} séries
                  </Text>
                </HStack>
                <HStack alignItems={'center'} space={2}>
                  <RepetitionIcon />
                  <Text fontSize={'md'} color={'gray.200'}>
                    {exercise?.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                onPress={handleExerciseHistoryRegister}
                mt={6}
                title="Marcar como realizado"
              />
            </VStack>
          </Skeleton>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
