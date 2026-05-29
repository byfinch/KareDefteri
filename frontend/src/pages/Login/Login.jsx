import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import styles from './Login.module.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  // banlı kullanıcı bilgisi (varsa özel kart gösterilecek)
  const [banInfo, setBanInfo] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // kullanıcı korumalı bir sayfadan login'e atıldıysa oraya geri dönsün
  const from = location.state?.from?.pathname || '/'
  // VerifyEmail'den gelen başarı mesajı (varsa)
  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBanInfo(null)

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }

    setSubmitting(true)
    try {
      const loggedInUser = await login(email, password)

      // admin ise direkt panele, normal kullanıcı ise geldiği yere
      const target = loggedInUser?.role === 'admin' ? '/admin' : from
      navigate(target, { replace: true })
    } catch (err) {
      const data = err.response?.data
      const status = err.response?.status

      // banlı kullanıcı (backend 403 + banned bilgisi dönerse)
      if (status === 403 && (data?.banned || data?.code === 'ACCOUNT_BANNED')) {
        setBanInfo({
          permanent: data?.permanent || data?.banUntil === null,
          until: data?.banUntil || null,
          reason: data?.banReason || data?.reason || null,
        })
        return
      }

      // diğer tüm hatalar için backend mesajını veya genel hatayı göster
      const message =
        data?.message ||
        'Giriş yapılamadı. Lütfen bilgilerini kontrol et.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  // ban tarihini güzel bir formata çevir (15 Haziran 2026 gibi)
  const formatBanDate = (dateString) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/logo.png" alt="KareDefteri" className={styles.logo} />
          <h1 className={styles.title}>KareDefteri</h1>
          <p className={styles.subtitle}>Hesabına giriş yap</p>
        </div>

        {/* banlı uyarısı */}
        {banInfo && (
          <div className={styles.banNotice}>
            <div className={styles.banIconWrap}>
              <span className={styles.banIcon}>⛔</span>
            </div>
            <h2 className={styles.banTitle}>Hesabınız Engellendi</h2>
            <p className={styles.banMessage}>
              {banInfo.permanent
                ? 'Hesabınız kalıcı olarak engellenmiştir.'
                : `Hesabınız ${formatBanDate(banInfo.until)} tarihine kadar engellenmiştir.`}
            </p>
            {banInfo.reason && (
              <p className={styles.banReason}>
                <strong>Sebep:</strong> {banInfo.reason}
              </p>
            )}
            <p className={styles.banFooter}>
              İtiraz için yönetimle iletişime geçin.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
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

          {successMessage && !error && !banInfo && (
            <p className={styles.success}>{successMessage}</p>
          )}
          {error && !banInfo && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={submitting}>
            {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className={styles.footer}>
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
