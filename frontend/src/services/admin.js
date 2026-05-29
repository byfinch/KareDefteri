import api from './api'

// raporlanan gönderiler listesi
export const getReportedPosts = async () => {
  const response = await api.get('/admin/reports')
  return response.data
}

// raporu işle: gizle ya da yok say
export const resolveReport = async (reportId, action) => {
  // action: 'hide' veya 'ignore'
  const response = await api.post(`/admin/reports/${reportId}/resolve`, { action })
  return response.data
}

// bütün kullanıcılar
export const getAllUsers = async () => {
  const response = await api.get('/admin/users')
  return response.data
}

// kullanıcıyı banla (gün sayısı ya da 'permanent')
export const banUser = async (userId, duration) => {
  const response = await api.post(`/admin/users/${userId}/ban`, { duration })
  return response.data
}

// ban kaldır
export const unbanUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}/ban`)
  return response.data
}

// genel istatistikler (kullanıcı, gönderi, coğrafi dağılım vs.)
export const getStatistics = async () => {
  const response = await api.get('/admin/statistics')
  return response.data
}
