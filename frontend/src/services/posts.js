import api from './api'

// Takip edilenlerin gönderilerini getir (anasayfa)
export const getFeed = async () => {
  const response = await api.get('/posts/feed')
  return response.data
}

// Belirli bir kullanıcının gönderilerini getir (profil)
export const getUserPosts = async (username) => {
  const response = await api.get(`/posts/user/${username}`)
  return response.data
}

// Tek bir gönderiyi getir
export const getPost = async (postId) => {
  const response = await api.get(`/posts/${postId}`)
  return response.data
}

// Yeni gönderi oluştur (sadece görsel)
export const createPost = async (formData) => {
  // formData: FormData nesnesi (image dosyası içerir)
  const response = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// Gönderiyi sil (yalnızca sahibi)
export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`)
  return response.data
}

// Beğen
export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`)
  return response.data
}

// Beğenme
export const dislikePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/dislike`)
  return response.data
}

// Tepkiyi geri al (beğeniyi/beğenmemeyi kaldır)
export const removeReaction = async (postId) => {
  const response = await api.delete(`/posts/${postId}/reaction`)
  return response.data
}

// Gönderiyi raporla
export const reportPost = async (postId, reason) => {
  const response = await api.post(`/posts/${postId}/report`, { reason })
  return response.data
}
