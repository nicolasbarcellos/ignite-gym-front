import { HStack, Skeleton, ISkeletonProps, VStack } from 'native-base'

type Props = {
  isLoaded: boolean
} & ISkeletonProps

export function GroupSkeleton({ isLoaded, ...rest }: Props) {
  return (
    <HStack space={3} {...rest}>
      <Skeleton
        w={'94'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
        startColor="gray.400"
        endColor="gray.900"
      />

      <Skeleton
        w={'94'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
        startColor={'gray.500'}
        endColor={'gray.400'}
      />

      <Skeleton
        w={'94'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
        startColor={'gray.500'}
        endColor={'gray.400'}
      />
      <Skeleton
        w={'94'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
        startColor={'gray.500'}
        endColor={'gray.400'}
      />
    </HStack>
  )
}

export function HistorySkeleton({ isLoaded, ...rest }: Props) {
  return (
    <VStack
      display={isLoaded ? 'none' : 'flex'}
      space={3}
      flex={1}
      mt={10}
      {...rest}
    >
      <Skeleton
        startColor="gray.400"
        endColor="gray.900"
        h={'87px'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
      />
      <Skeleton
        startColor="gray.400"
        endColor="gray.900"
        h={'87px'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
      />
      <Skeleton
        startColor="gray.400"
        endColor="gray.900"
        h={'87px'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
      />
      <Skeleton
        startColor="gray.400"
        endColor="gray.900"
        h={'87px'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
      />
    </VStack>
  )
}

export function ExerciseSkeleton({ isLoaded, ...rest }: Props) {
  return (
    <VStack display={isLoaded ? 'none' : 'flex'} space={3} flex={1} {...rest}>
      <Skeleton
        startColor="gray.400"
        endColor="gray.900"
        h={'87px'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
      />
      <Skeleton
        startColor="gray.400"
        endColor="gray.900"
        h={'87px'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
      />
      <Skeleton
        startColor="gray.400"
        endColor="gray.900"
        h={'87px'}
        rounded={'md'}
        bg={'gray.600'}
        isLoaded={isLoaded}
      />
    </VStack>
  )
}
