import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { loginUser, registerUser, logoutUser } from '../services/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // sayfa ilk açıldığında localStorage'dan kullanıcıyı çek
  // böylece sayfa yenilense de oturum kaybolmaz
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        // bozuk veri varsa temizle
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  // giriş yapınca token ve user bilgisini sakla
  const login = async (email, password) => {
    const data = await loginUser({ email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  // kayıt olunca otomatik giriş yapmıyoruz
  // önce e-posta doğrulaması lazım
  const register = async (userData) => {
    return await registerUser(userData)
  }

  // çıkış yap
  const logout = async () => {
    try {
      await logoutUser()
    } catch {
      // backend hata verse bile devam et, önemli olan local temizleme
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
