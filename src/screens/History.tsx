import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryDTO } from '@dtos/HistoryDTO'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

import { Heading, Text, VStack, useToast } from 'native-base'
import React, { useCallback, useState } from 'react'
import { SectionList, View } from 'react-native'
import { HistorySkeleton } from '../styles/skeletons'
import { useFocusEffect } from '@react-navigation/native'

type HistoryProps = {
  title: string
  data: HistoryDTO[]
}

export function History() {
  const [exercises, setExercies] = useState<HistoryProps[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const toast = useToast()

  async function fetchHistory() {
    try {
      const { data } = await api.get('history')
      setExercies(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o histórico'
      toast.show({
        title,
        placement: 'top',
        bg: 'red.500',
      })
    } finally {
      setIsLoaded(true)
    }
  }
  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, []),
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <VStack px={6} flex={1}>
        <HistorySkeleton isLoaded={isLoaded} />
        <SectionList
          sections={exercises}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Heading
              fontFamily={'heading'}
              color={'gray.200'}
              fontSize={'md'}
              mt={10}
              mb={3}
            >
              {title}
            </Heading>
          )}
          ListEmptyComponent={() => (
            <Text color={'gray.100'} textAlign={'center'}>
              {isLoaded && 'Não há exercícios registrados ainda.'}
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: isLoaded && exercises.length ? 0 : 1,
            justifyContent: 'center',
            paddingBottom: 40,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          keyExtractor={(item) => item.id}
        />
      </VStack>
    </VStack>
  )
}
