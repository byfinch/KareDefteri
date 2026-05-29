import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import {
  likePost,
  dislikePost,
  removeReaction,
  deletePost,
  reportPost,
} from '../../services/posts'
import Modal from '../Modal/Modal'
import styles from './PostCard.module.css'

// rapor sebepleri (kullanıcı bunlardan birini seçecek)
const REPORT_REASONS = [
  {
    value: 'Uygunsuz İçerik',
    description: 'Yetişkin içerik, şiddet veya rahatsız edici görseller',
  },
  {
    value: 'Spam',
    description: 'Yanıltıcı, tekrarlayan veya alakasız içerik',
  },
  {
    value: 'Taciz veya Zorbalık',
    description: 'Bir kişiye yönelik kötü niyetli paylaşım',
  },
  {
    value: 'Yanlış Bilgi',
    description: 'Gerçek olmayan veya yanıltıcı bilgi içeriyor',
  },
]

function PostCard({ post, onDelete }) {
  const { user } = useAuth()

  // beğeni/beğenmeme durumu ve sayılar
  const [reaction, setReaction] = useState(post.userReaction || null)
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)
  const [dislikeCount, setDislikeCount] = useState(post.dislikeCount || 0)

  // raporlama modal state'leri
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState(null)
  const [reportMsg, setReportMsg] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)

  // silme modal state'leri
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState('')

  // iki butona aynı anda spam tıklamayı engelle
  const [busy, setBusy] = useState(false)

  // bu gönderi benim mi? (sil butonu sadece kendi gönderimde çıksın diye)
  const isOwner = user?.id === post.author?.id

  // beğen butonuna tıklayınca
  const handleLike = async () => {
    if (busy) return
    setBusy(true)
    // hata olursa eski hale dönmek için yedek alıyoruz
    const prev = { reaction, likeCount, dislikeCount }
    try {
      if (reaction === 'like') {
        // zaten beğenmişti, geri alıyor
        setReaction(null)
        setLikeCount((c) => c - 1)
        await removeReaction(post.id)
      } else {
        // yeni beğeni
        setReaction('like')
        setLikeCount((c) => c + 1)
        // dislike vermişse onu da sayıyı azaltarak temizle
        if (reaction === 'dislike') setDislikeCount((c) => c - 1)
        await likePost(post.id)
      }
    } catch {
      // backend hata verdiyse UI'ı eski haline çevir
      setReaction(prev.reaction)
      setLikeCount(prev.likeCount)
      setDislikeCount(prev.dislikeCount)
    } finally {
      setBusy(false)
    }
  }

  // beğenme butonuna tıklayınca (handleLike'ın benzeri)
  const handleDislike = async () => {
    if (busy) return
    setBusy(true)
    const prev = { reaction, likeCount, dislikeCount }
    try {
      if (reaction === 'dislike') {
        setReaction(null)
        setDislikeCount((c) => c - 1)
        await removeReaction(post.id)
      } else {
        setReaction('dislike')
        setDislikeCount((c) => c + 1)
        if (reaction === 'like') setLikeCount((c) => c - 1)
        await dislikePost(post.id)
      }
    } catch {
      setReaction(prev.reaction)
      setLikeCount(prev.likeCount)
      setDislikeCount(prev.dislikeCount)
    } finally {
      setBusy(false)
    }
  }

  // silme onay modalını kapat
  const closeDeleteModal = () => {
    // silme işlemi sürerken kapanmasın
    if (deleteSubmitting) return
    setDeleteOpen(false)
    setDeleteMsg('')
  }

  // silme işlemini başlat
  const handleDelete = async () => {
    setDeleteSubmitting(true)
    setDeleteMsg('')
    try {
      await deletePost(post.id)
      // üst component'e haber ver (listeden çıkarsın)
      if (onDelete) onDelete(post.id)
    } catch {
      setDeleteMsg('Gönderi silinemedi. Tekrar deneyin.')
      setDeleteSubmitting(false)
    }
  }

  // rapor modalını kapat ve temizle
  const closeReportModal = () => {
    if (reportSubmitting) return
    setReportOpen(false)
    setSelectedReason(null)
    setReportMsg('')
  }

  // raporu gönder
  const handleReport = async () => {
    if (!selectedReason) {
      setReportMsg('Lütfen bir sebep seçin.')
      return
    }
    setReportSubmitting(true)
    try {
      await reportPost(post.id, selectedReason)
      setReportMsg('Rapor gönderildi. Teşekkürler.')
      // başarı mesajı görünsün, sonra otomatik kapansın
      setTimeout(() => {
        closeReportModal()
      }, 1200)
    } catch {
      setReportMsg('Rapor gönderilemedi.')
    } finally {
      setReportSubmitting(false)
    }
  }

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <Link to={`/profile/${post.author?.username}`} className={styles.author}>
          <div className={styles.avatar}>
            {post.author?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <span className={styles.username}>@{post.author?.username}</span>
        </Link>
        <span className={styles.date}>
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR') : ''}
        </span>
      </header>

      <div className={styles.imageWrapper}>
        <img src={post.imageUrl} alt="Gönderi" className={styles.image} />
      </div>

      <footer className={styles.footer}>
        <div className={styles.reactions}>
          <button
            onClick={handleLike}
            className={`${styles.reactionButton} ${reaction === 'like' ? styles.likeActive : ''}`}
            disabled={busy}
            aria-label="Beğen"
          >
            <span className={styles.icon}>👍</span> {likeCount}
          </button>
          <button
            onClick={handleDislike}
            className={`${styles.reactionButton} ${reaction === 'dislike' ? styles.dislikeActive : ''}`}
            disabled={busy}
            aria-label="Beğenme"
          >
            <span className={styles.icon}>👎</span> {dislikeCount}
          </button>
        </div>

        <div className={styles.actions}>
          {/* gönderi sahibine sil, başkalarına raporla göster */}
          {isOwner ? (
            <button onClick={() => setDeleteOpen(true)} className={styles.actionButton}>
              Sil
            </button>
          ) : (
            <button onClick={() => setReportOpen(true)} className={styles.actionButton}>
              Raporla
            </button>
          )}
        </div>
      </footer>

      {/* raporlama modalı */}
      <Modal open={reportOpen} onClose={closeReportModal} title="Gönderiyi Rapor Et">
        <div className={styles.reportContent}>
          <p className={styles.reportQuestion}>Bu gönderiyi neden raporluyorsunuz?</p>

          <div className={styles.reasonList}>
            {REPORT_REASONS.map((reason) => {
              const isSelected = selectedReason === reason.value
              return (
                <button
                  key={reason.value}
                  type="button"
                  onClick={() => {
                    setSelectedReason(reason.value)
                    setReportMsg('')
                  }}
                  className={`${styles.reasonOption} ${isSelected ? styles.reasonSelected : ''}`}
                  disabled={reportSubmitting}
                >
                  <div className={styles.reasonText}>
                    <span className={styles.reasonTitle}>{reason.value}</span>
                    <span className={styles.reasonDescription}>{reason.description}</span>
                  </div>
                  <span className={`${styles.radio} ${isSelected ? styles.radioSelected : ''}`}>
                    {isSelected && <span className={styles.radioInner} />}
                  </span>
                </button>
              )
            })}
          </div>

          {reportMsg && <p className={styles.reportMessage}>{reportMsg}</p>}

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={closeReportModal}
              className={styles.cancelButton}
              disabled={reportSubmitting}
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleReport}
              className={styles.dangerSubmitButton}
              disabled={!selectedReason || reportSubmitting}
            >
              {reportSubmitting ? 'Gönderiliyor...' : 'Rapor Et'}
            </button>
          </div>
        </div>
      </Modal>

      {/* silme onay modalı */}
      <Modal open={deleteOpen} onClose={closeDeleteModal} title="Gönderiyi Sil">
        <div className={styles.deleteContent}>
          <div className={styles.deleteIconWrap}>
            <span className={styles.deleteIcon}>🗑️</span>
          </div>

          <p className={styles.deleteQuestion}>
            Bu gönderiyi silmek istediğine emin misin?
          </p>
          <p className={styles.deleteWarning}>
            Bu işlem geri alınamaz.
          </p>

          {deleteMsg && <p className={styles.reportMessage}>{deleteMsg}</p>}

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={closeDeleteModal}
              className={styles.cancelButton}
              disabled={deleteSubmitting}
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className={styles.dangerSubmitButton}
              disabled={deleteSubmitting}
            >
              {deleteSubmitting ? 'Siliniyor...' : 'Evet, Sil'}
            </button>
          </div>
        </div>
      </Modal>
    </article>
  )
}

export default PostCard
