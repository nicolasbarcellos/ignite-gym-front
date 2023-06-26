import { AuthContext } from '@contexts/AuthContext'
import { useContext } from 'react'

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  return ctx
}
