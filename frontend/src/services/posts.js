import api from './api'

// ana sayfa için: takip edilenlerin gönderileri
export const getFeed = async () => {
  const response = await api.get('/posts/feed')
  return response.data
}

// bir kullanıcının kendi gönderileri (profil sayfası için)
export const getUserPosts = async (username) => {
  const response = await api.get(`/posts/user/${username}`)
  return response.data
}

// tek gönderi detayı
export const getPost = async (postId) => {
  const response = await api.get(`/posts/${postId}`)
  return response.data
}

// yeni gönderi paylaş (sadece görsel)
export const createPost = async (formData) => {
  // FormData kullanıyoruz çünkü dosya yüklüyoruz
  const response = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// kendi gönderini sil
export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`)
  return response.data
}

// beğen
export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`)
  return response.data
}

// beğenme
export const dislikePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/dislike`)
  return response.data
}

// oyunu geri al
export const removeReaction = async (postId) => {
  const response = await api.delete(`/posts/${postId}/reaction`)
  return response.data
}

// gönderiyi raporla
export const reportPost = async (postId, reason) => {
  const response = await api.post(`/posts/${postId}/report`, { reason })
  return response.data
}
