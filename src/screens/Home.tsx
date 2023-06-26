import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import {
  FlatList,
  HStack,
  Heading,
  Text,
  VStack,
  View,
  useToast,
} from 'native-base'
import { useCallback, useEffect, useState } from 'react'

import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { AppRoutesNavigatorProps } from '@routes/app.routes'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { ExerciseSkeleton, GroupSkeleton } from '../styles/skeletons'

export function Home() {
  const navigation = useNavigation<AppRoutesNavigatorProps>()
  const toast = useToast()
  const [groups, setGroups] = useState<string[]>([])
  const [activeItem, setActiveItem] = useState<string>()
  const [isLoadedGroups, setIsLoadedGroups] = useState(false)
  const [isLoadedExercises, setIsLoadedExercises] = useState(false)

  const [exercices, setExercices] = useState<ExerciseDTO[]>([])

  function handleOpenExerciseDetails(exerciseID: string) {
    navigation.navigate('exercise', { exerciseID })
  }

  async function fetchGroups() {
    try {
      const { data } = await api.get('groups')
      setGroups(data)
      setActiveItem(data[0])
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares.'
      toast.show({
        title,
        placement: 'top',
        bg: 'red.500',
      })
    } finally {
      setIsLoadedGroups(true)
    }
  }

  async function fetchExercisesByGroup() {
    try {
      const { data } = await api.get(`exercises/bygroup/${activeItem}`)
      setExercices(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      console.log(error)
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os exercicíos'
      toast.show({
        title,
        placement: 'top',
        bg: 'red.500',
      })
    } finally {
      setIsLoadedExercises(true)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [activeItem]),
  )

  return (
    <VStack flex={1}>
      <HomeHeader />
      <VStack mt={6} px={6}>
        <GroupSkeleton isLoaded={isLoadedGroups} />
        <FlatList
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={groups}
          renderItem={({ item }) => (
            <Group
              onPress={() => setActiveItem(item)}
              isActive={item === activeItem}
              data={item}
            />
          )}
          keyExtractor={(item) => item}
        />
      </VStack>

      <VStack mt={10} flex={1} px={6}>
        <HStack mb={5} justifyContent={'space-between'} alignItems={'center'}>
          <Heading color={'gray.200'} fontSize={'md'} fontFamily={'heading'}>
            Exercícios
          </Heading>
          <Text color={'gray.200'} fontSize={'sm'}>
            {exercices.length}
          </Text>
        </HStack>
        <ExerciseSkeleton isLoaded={isLoadedExercises} />
        <FlatList
          data={exercices}
          renderItem={({ item }) => (
            <ExerciseCard
              onPress={() => handleOpenExerciseDetails(item.id)}
              data={item}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          keyExtractor={(item) => item.id}
        />
      </VStack>
    </VStack>
  )
}
