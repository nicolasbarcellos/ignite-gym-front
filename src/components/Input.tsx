import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
  Icon,
} from 'native-base'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  errorMessage?: string | null
} & IInputProps

export function Input({ errorMessage = null, ...rest }: Props) {
  return (
    <FormControl isInvalid={!!errorMessage}>
      <NativeBaseInput
        bg={'gray.700'}
        h={14}
        px={4}
        borderWidth={1}
        borderColor={'transparent'}
        fontSize={'sm'}
        color={'white'}
        fontFamily="body"
        mb={errorMessage ? 0 : 4}
        placeholderTextColor={'gray.300'}
        {...rest}
        _invalid={{
          borderColor: 'red.500',
        }}
        _focus={{
          bg: 'gray.700',
          borderColor: 'green.500',
        }}
      />
      <FormControl.ErrorMessage
        mb={5}
        _text={{ color: 'red.500' }}
        leftIcon={
          <Icon as={Ionicons} name="alert-circle-outline" size={'xs'} />
        }
      >
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
