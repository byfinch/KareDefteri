import api from './api'

// Kayıt
export const registerUser = async (userData) => {
  // userData: { username, email, password }
  const response = await api.post('/auth/register', userData)
  return response.data
}

// Giriş
export const loginUser = async (credentials) => {
  // credentials: { email, password }
  // Backend dönüşü: { token: "...", user: { id, username, email, role } }
  const response = await api.post('/auth/login', credentials)
  return response.data
}

// E-posta doğrulama
export const verifyEmail = async (code) => {
  const response = await api.post('/auth/verify-email', { code })
  return response.data
}

// Yeniden kod gönder
export const resendVerificationCode = async (email) => {
  const response = await api.post('/auth/resend-code', { email })
  return response.data
}

// Çıkış (opsiyonel — backend session tutuyorsa)
export const logoutUser = async () => {
  await api.post('/auth/logout')
}