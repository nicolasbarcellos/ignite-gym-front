import { HistoryDTO } from '@dtos/HistoryDTO'

import { HStack, Heading, Text, VStack } from 'native-base'
import React from 'react'

type Props = {
  data: HistoryDTO
}

export function HistoryCard({ data }: Props) {
  const { group, hour, name } = data

  return (
    <HStack
      w={'full'}
      px={5}
      py={4}
      rounded={'md'}
      bg={'gray.600'}
      alignItems={'center'}
    >
      <VStack flex={1}>
        <Heading
          color={'white'}
          fontSize={'md'}
          textTransform={'capitalize'}
          numberOfLines={1}
          fontFamily={'heading'}
        >
          {group}
        </Heading>
        <Text color={'gray.100'} fontSize={'lg'} numberOfLines={1}>
          {name}
        </Text>
      </VStack>
      <Text color={'gray.300'} fontSize={'md'}>
        {hour}
      </Text>
    </HStack>
  )
}
