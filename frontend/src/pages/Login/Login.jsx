import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Login.module.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }

    console.log('Giriş denemesi:', { email, password })
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/logo.png" alt="KareDefteri" className={styles.logo} />
          <h1 className={styles.title}>KareDefteri</h1>
          <p className={styles.subtitle}>Hesabına giriş yap</p>
        </div>

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
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button}>
            Giriş Yap
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
