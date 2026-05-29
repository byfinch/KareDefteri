import { useContext } from 'react'
import { AuthContext } from './AuthContext'

// her yerde context'i kolayca kullanmak için custom hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.')
  }
  return context
}
