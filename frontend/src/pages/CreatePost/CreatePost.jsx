import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { createPost } from '../../services/posts'
import styles from './CreatePost.module.css'

function CreatePost() {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      setError('Lütfen bir görsel dosyası seç.')
      return
    }
    // 10MB sınırı
    if (selected.size > 10 * 1024 * 1024) {
      setError('Görsel boyutu 10MB altında olmalı.')
      return
    }

    setError('')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Lütfen paylaşacağın görseli seç.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      await createPost(formData)
      // Paylaşım sonrası kendi profile gidiyor — yeni gönderi orada görünür
      // (Ana sayfa sadece takip edilen kullanıcıların paylaşımlarını gösterir)
      navigate(`/profile/${user?.username || ''}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Gönderi paylaşılamadı.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Yeni Gönderi</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.uploadArea}>
          {preview ? (
            <img src={preview} alt="Önizleme" className={styles.preview} />
          ) : (
            <label htmlFor="image" className={styles.uploadLabel}>
              <span className={styles.uploadIcon}>+</span>
              <span>Görsel seçmek için tıkla</span>
              <small>PNG, JPG, GIF — en fazla 10MB</small>
            </label>
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
            disabled={submitting}
          />
          {preview && (
            <button
              type="button"
              onClick={() => {
                setFile(null)
                setPreview('')
              }}
              className={styles.changeButton}
              disabled={submitting}
            >
              Görseli değiştir
            </button>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? 'Paylaşılıyor...' : 'Paylaş'}
        </button>
      </form>
    </div>
  )
}

export default CreatePost
