import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return null
  }

  // Giriş yapmamışsa → uygun login sayfasına gönder
  if (!isAuthenticated) {
    const loginPath = requireAdmin ? '/admin/login' : '/login'
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  // Admin rotası ama kullanıcı admin değilse → anasayfaya gönder
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  // Normal kullanıcı rotası ama kullanıcı admin → admin paneline gönder
  if (!requireAdmin && user.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute
