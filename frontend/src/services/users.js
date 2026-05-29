import api from './api'

// başka bir kullanıcının profili
export const getUserProfile = async (username) => {
  const response = await api.get(`/users/${username}`)
  return response.data
}

// kendi profilim
export const getMyProfile = async () => {
  const response = await api.get('/users/me')
  return response.data
}

// kullanıcıyı takip et
export const followUser = async (username) => {
  const response = await api.post(`/users/${username}/follow`)
  return response.data
}

// takipten çık
export const unfollowUser = async (username) => {
  const response = await api.delete(`/users/${username}/follow`)
  return response.data
}

// kullanıcının takipçileri
export const getFollowers = async (username) => {
  const response = await api.get(`/users/${username}/followers`)
  return response.data
}

// kullanıcının takip ettikleri
export const getFollowing = async (username) => {
  const response = await api.get(`/users/${username}/following`)
  return response.data
}

// kullanıcı arama (search bar için)
export const searchUsers = async (query) => {
  const response = await api.get('/users/search', { params: { q: query } })
  return response.data
}
