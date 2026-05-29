import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { verifyEmail, resendVerificationCode } from '../../services/auth'
import styles from './VerifyEmail.module.css'

function VerifyEmail() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  // Register sayfasından gelirken state ile email yolladık, onu yakalıyoruz
  const email = location.state?.email

  // kod gönder butonuna basınca
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!code) {
      setError('Lütfen doğrulama kodunu girin.')
      return
    }
    if (code.length !== 6) {
      setError('Doğrulama kodu 6 haneli olmalı.')
      return
    }

    setSubmitting(true)
    try {
      await verifyEmail(code)
      // başarılı: login sayfasına yönlendir ve başarı mesajı göster
      navigate('/login', {
        state: { message: 'E-posta doğrulandı! Giriş yapabilirsiniz.' },
      })
    } catch (err) {
      const msg = err.response?.data?.message || 'Kod doğrulanamadı.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // kod gelmediyse yeniden istemek için
  const handleResend = async () => {
    setError('')
    setMessage('')

    // bilgi yoksa hangi adrese yollayacağımızı bilemeyiz
    if (!email) {
      setError('E-posta bilgisi bulunamadı. Tekrar kayıt olmanız gerekebilir.')
      return
    }

    try {
      await resendVerificationCode(email)
      setMessage('Yeni kod e-postana gönderildi.')
    } catch (err) {
      const msg = err.response?.data?.message || 'Kod gönderilemedi.'
      setError(msg)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/logo.png" alt="KareDefteri" className={styles.logo} />
          <h1 className={styles.title}>E-posta Doğrulama</h1>
          <p className={styles.subtitle}>
            {email
              ? `${email} adresine gönderdiğimiz 6 haneli kodu gir.`
              : 'E-posta adresine gönderdiğimiz 6 haneli kodu gir.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="code">Doğrulama Kodu</label>
            <input
              id="code"
              type="text"
              value={code}
              // sadece rakam ve max 6 hane kabul et
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="123456"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              className={styles.codeInput}
              disabled={submitting}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <button type="submit" className={styles.button} disabled={submitting}>
            {submitting ? 'Doğrulanıyor...' : 'Doğrula'}
          </button>
        </form>

        <p className={styles.footer}>
          Kodu almadın mı?{' '}
          <button
            type="button"
            onClick={handleResend}
            className={styles.linkButton}
          >
            Yeniden gönder
          </button>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmail
