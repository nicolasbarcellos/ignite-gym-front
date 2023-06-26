import { Image, IImageProps } from 'native-base'

type Props = {
  size: number
} & IImageProps

export function UserPhoto({ size, ...rest }: Props) {
  return (
    <Image
      borderWidth={2}
      bgColor={'gray.400'}
      rounded={'full'}
      width={size}
      height={size}
      {...rest}
    />
  )
}
