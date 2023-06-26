import { HStack, Heading, Icon, Image, Text, VStack } from 'native-base'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { api } from '@services/api'

type Props = {
  data: ExerciseDTO
} & TouchableOpacityProps

export function ExerciseCard({ data, ...rest }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.7} {...rest}>
      <HStack
        bg={'gray.500'}
        alignItems={'center'}
        p={2}
        pr={4}
        borderRadius={'md'}
      >
        <Image
          w={16}
          h={16}
          resizeMode="cover"
          source={{
            uri: `${api.defaults.baseURL}exercise/thumb/${data.thumb}`,
          }}
          alt="Pessoa fazendo exercício"
          borderRadius={'md'}
          mr={4}
        />
        <VStack flex={1}>
          <Heading color={'white'} fontSize={'lg'} fontFamily={'heading'}>
            {data.name}
          </Heading>
          <Text color={'gray.200'} fontSize={'sm'} mt={1} numberOfLines={2}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>
        <Icon
          as={MaterialIcons}
          name="chevron-right"
          size={7}
          color={'gray.300'}
        />
      </HStack>
    </TouchableOpacity>
  )
}
