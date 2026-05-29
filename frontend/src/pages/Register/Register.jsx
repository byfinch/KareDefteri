import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import styles from './Register.module.css'

function Register() {
  // form alanlarının state'leri
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  // form doğrulamaları
  const validate = () => {
    if (!username || !email || !password || !passwordConfirm) {
      return 'Lütfen tüm alanları doldurun.'
    }
    if (username.length < 3) {
      return 'Kullanıcı adı en az 3 karakter olmalı.'
    }
    if (!email.includes('@') || !email.includes('.')) {
      return 'Geçerli bir e-posta adresi girin.'
    }
    if (password.length < 6) {
      return 'Şifre en az 6 karakter olmalı.'
    }
    if (password !== passwordConfirm) {
      return 'Şifreler eşleşmiyor.'
    }
    return null
  }

  // form gönderildiğinde
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // önce kontrolleri yap
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    try {
      await register({ username, email, password })
      // kayıt başarılı, e-posta doğrulama sayfasına git
      // e-postayı state ile taşıyoruz (orada gösterilsin diye)
      navigate('/verify-email', { state: { email } })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Kayıt yapılamadı. Lütfen tekrar deneyin.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/logo.png" alt="KareDefteri" className={styles.logo} />
          <h1 className={styles.title}>KareDefteri</h1>
          <p className={styles.subtitle}>Yeni hesap oluştur</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username">Kullanıcı adı</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kullanici_adi"
              autoComplete="username"
              disabled={submitting}
            />
          </div>

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
              placeholder="En az 6 karakter"
              autoComplete="new-password"
              disabled={submitting}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="passwordConfirm">Şifre (tekrar)</label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Şifreni tekrar gir"
              autoComplete="new-password"
              disabled={submitting}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={submitting}>
            {submitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className={styles.footer}>
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
