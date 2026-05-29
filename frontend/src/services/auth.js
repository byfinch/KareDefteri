import api from './api'

// yeni kullanıcı kaydı
export const registerUser = async (userData) => {
  // userData içinde username, email, password var
  const response = await api.post('/auth/register', userData)
  return response.data
}

// giriş yap
export const loginUser = async (credentials) => {
  // backend bize token ve user bilgilerini dönecek
  const response = await api.post('/auth/login', credentials)
  return response.data
}

// e-posta doğrulama (6 haneli kod)
export const verifyEmail = async (code) => {
  const response = await api.post('/auth/verify-email', { code })
  return response.data
}

// kod gelmezse yeniden iste
export const resendVerificationCode = async (email) => {
  const response = await api.post('/auth/resend-code', { email })
  return response.data
}

// çıkış (backend session tutuyorsa lazım)
export const logoutUser = async () => {
  await api.post('/auth/logout')
}
