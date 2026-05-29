import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
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
      {/* herkesin erişebileceği sayfalar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* giriş yapmış kullanıcılar için sayfalar */}
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

        {/* admin sayfası — sadece admin rolüne erişim */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* tanımsız URL'leri ana sayfaya yolla */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
