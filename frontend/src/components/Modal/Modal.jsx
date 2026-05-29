import { useEffect } from 'react'
import styles from './Modal.module.css'

function Modal({ open, onClose, title, children }) {
  // ESC tuşuna basınca kapansın
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    // dışarı tıklayınca da kapanıyor
    <div className={styles.backdrop} onClick={onClose}>
      {/* iç tıklamanın yukarı yayılmasını engelliyoruz */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Kapat">
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
