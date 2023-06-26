import { Pressable, Text, IPressableProps } from 'native-base'

type Props = {
  data: String
  isActive?: boolean
} & IPressableProps

export function Group({ data, isActive = false, ...rest }: Props) {
  return (
    <Pressable
      py={'3'}
      px={'6'}
      rounded={'md'}
      bg={'gray.600'}
      borderWidth={1}
      borderColor={isActive ? 'green.500' : 'transparent'}
      {...rest}
    >
      <Text
        fontSize="xs"
        fontWeight={'bold'}
        textTransform={'uppercase'}
        color={isActive ? 'green.500' : 'gray.200'}
      >
        {data}
      </Text>
    </Pressable>
  )
}
