import api from './api'

// Tüm bildirimleri getir
export const getNotifications = async () => {
  const response = await api.get('/notifications')
  return response.data
}

// Okunmamış bildirim sayısını getir (badge için)
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count')
  return response.data
}

// Tek bildirimi okundu olarak işaretle
export const markAsRead = async (notificationId) => {
  const response = await api.post(`/notifications/${notificationId}/read`)
  return response.data
}

// Tüm bildirimleri okundu olarak işaretle
export const markAllAsRead = async () => {
  const response = await api.post('/notifications/read-all')
  return response.data
}
