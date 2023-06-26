/* eslint-disable no-useless-catch */
import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import {
  storageUserGet,
  storageUserSave,
  storageUserRemove,
} from '@storage/storageUser'
import { ReactNode, createContext, useEffect, useState } from 'react'

type AuthContextDataProps = {
  user: UserDTO
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoadingUserStorageData: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export const AuthProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function userAndTokenUpdate(user: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    setUser(user)
  }

  async function userAndTokenStorageSave(
    user: UserDTO,
    token: string,
    refresh_token: string,
  ) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(user)
      await storageAuthTokenSave({ token, refresh_token })
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/sessions', { email, password })

      if (data.user && data.token && data.refresh_token) {
        await userAndTokenStorageSave(data.user, data.token, data.refresh_token)
        userAndTokenUpdate(data.user, data.token)
      }
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  const loadingUserData = async () => {
    try {
      setIsLoadingUserStorageData(true)
      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()
      if (userLogged && token) {
        userAndTokenUpdate(userLogged, token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadingUserData()
  }, [])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [signOut])

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUserProfile,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
