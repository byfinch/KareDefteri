import api from './api'

// Raporlanan gönderileri listele
export const getReportedPosts = async () => {
  const response = await api.get('/admin/reports')
  return response.data
}

// Raporu işle (görünürlüğü kısıtla / yok say)
export const resolveReport = async (reportId, action) => {
  // action: 'hide' | 'ignore'
  const response = await api.post(`/admin/reports/${reportId}/resolve`, { action })
  return response.data
}

// Tüm kullanıcıları listele
export const getAllUsers = async () => {
  const response = await api.get('/admin/users')
  return response.data
}

// Kullanıcıyı banla (geçici veya kalıcı)
export const banUser = async (userId, duration) => {
  // duration: 'permanent' veya gün sayısı (ör: 7)
  const response = await api.post(`/admin/users/${userId}/ban`, { duration })
  return response.data
}

// Banı kaldır
export const unbanUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}/ban`)
  return response.data
}

// Sistem istatistikleri
export const getStatistics = async () => {
  const response = await api.get('/admin/statistics')
  return response.data
}
