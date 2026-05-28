import api from './api'

// Kullanıcı profili getir
export const getUserProfile = async (username) => {
  const response = await api.get(`/users/${username}`)
  return response.data
}

// Mevcut kullanıcının kendi profilini getir
export const getMyProfile = async () => {
  const response = await api.get('/users/me')
  return response.data
}

// Kullanıcıyı takip et
export const followUser = async (username) => {
  const response = await api.post(`/users/${username}/follow`)
  return response.data
}

// Takipten çıkar
export const unfollowUser = async (username) => {
  const response = await api.delete(`/users/${username}/follow`)
  return response.data
}

// Takipçileri listele
export const getFollowers = async (username) => {
  const response = await api.get(`/users/${username}/followers`)
  return response.data
}

// Takip ettiklerini listele
export const getFollowing = async (username) => {
  const response = await api.get(`/users/${username}/following`)
  return response.data
}

// Kullanıcı ara
export const searchUsers = async (query) => {
  const response = await api.get('/users/search', { params: { q: query } })
  return response.data
}
