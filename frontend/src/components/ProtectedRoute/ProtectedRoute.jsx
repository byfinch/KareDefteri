import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  // context henüz localStorage'ı okumadıysa bekle
  if (loading) {
    return null
  }

  // giriş yapmamış kullanıcıyı login'e yolla
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // admin sayfası ama kullanıcı admin değil → ana sayfaya
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
