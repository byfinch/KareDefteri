import api from './api'

// tüm bildirimlerim
export const getNotifications = async () => {
  const response = await api.get('/notifications')
  return response.data
}

// okunmamış bildirim sayısı (zilin yanındaki rozet için)
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count')
  return response.data
}

// tek bildirimi okundu yap
export const markAsRead = async (notificationId) => {
  const response = await api.post(`/notifications/${notificationId}/read`)
  return response.data
}

// hepsini okundu yap
export const markAllAsRead = async () => {
  const response = await api.post('/notifications/read-all')
  return response.data
}
