import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Layout from './components/Layout/Layout'
import AdminLayout from './components/AdminLayout/AdminLayout'
import Login from './pages/Login/Login'
import AdminLogin from './pages/AdminLogin/AdminLogin'
import Register from './pages/Register/Register'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'
import Followers from './pages/Followers/Followers'
import CreatePost from './pages/CreatePost/CreatePost'
import Admin from './pages/Admin/Admin'

function App() {
  return (
    <Routes>
      {/* Public rotalar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Admin girişi — ayrı sayfa */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Standart kullanıcı rotaları */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/followers/:username" element={<Followers />} />
      </Route>

      {/* Admin rotaları */}
      <Route
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Admin />} />
      </Route>

      {/* Tanımsız URL'leri anasayfaya yönlendir */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
