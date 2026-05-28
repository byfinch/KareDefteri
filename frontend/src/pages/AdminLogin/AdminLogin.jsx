import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import styles from './AdminLogin.module.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, logout } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }

    setSubmitting(true)
    try {
      const loggedInUser = await login(email, password)

      // Yalnızca admin rolü kabul edilir
      if (loggedInUser?.role !== 'admin') {
        // Token saklandı ama bu yönetici girişi — temizle
        await logout()
        setError('Bu hesabın yönetici yetkisi yok.')
        return
      }

      navigate('/admin', { replace: true })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Giriş yapılamadı. Lütfen bilgilerini kontrol et.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <img src="/logo.png" alt="KareDefteri" className={styles.logo} />
          </div>
          <h1 className={styles.title}>Yönetici Girişi</h1>
          <p className={styles.subtitle}>KareDefteri yönetim paneli</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yonetici@karedefteri.com"
              autoComplete="email"
              disabled={submitting}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={submitting}>
            {submitting ? 'Giriş yapılıyor...' : 'Panele Giriş Yap'}
          </button>
        </form>

        <p className={styles.footer}>
          Bu sayfa yalnızca yetkili yöneticiler içindir.
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
