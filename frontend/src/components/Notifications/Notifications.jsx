import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../../services/notifications'
import styles from './Notifications.module.css'

function Notifications() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()

  // Sayfa açıldığında ve her 30 saniyede bir okunmamış sayısını çek
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getUnreadCount()
        setUnread(data?.count || 0)
      } catch {
        // sessiz geç
      }
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Açıldığında bildirimleri çek
  useEffect(() => {
    if (!open) return
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await getNotifications()
        setItems(data || [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [open])

  // Dışarı tıklanınca kapat
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleItemClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif.id)
        setUnread((c) => Math.max(0, c - 1))
        setItems((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        )
      } catch {
        // sessiz geç
      }
    }
    setOpen(false)

    // Bildirim tipine göre yönlendirme
    if (notif.type === 'follow' && notif.fromUser?.username) {
      navigate(`/profile/${notif.fromUser.username}`)
    } else if (notif.type === 'like' || notif.type === 'dislike') {
      if (notif.post?.author?.username) {
        navigate(`/profile/${notif.post.author.username}`)
      }
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setUnread(0)
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      // sessiz geç
    }
  }

  const formatMessage = (notif) => {
    const from = notif.fromUser?.username || 'Birisi'
    switch (notif.type) {
      case 'follow':
        return `@${from} seni takip etmeye başladı`
      case 'like':
        return `@${from} gönderini beğendi`
      case 'dislike':
        return `@${from} gönderini beğenmedi`
      default:
        return notif.message || 'Yeni bir bildirim'
    }
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={styles.bellButton}
        aria-label="Bildirimler"
      >
        <span className={styles.bellIcon}>🔔</span>
        {unread > 0 && (
          <span className={styles.badge}>{unread > 99 ? '99+' : unread}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <header className={styles.header}>
            <h3>Bildirimler</h3>
            {unread > 0 && (
              <button onClick={handleMarkAllRead} className={styles.markAllButton}>
                Tümünü oku
              </button>
            )}
          </header>

          {loading ? (
            <div className={styles.empty}>Yükleniyor...</div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>Henüz bildirim yok.</div>
          ) : (
            <ul className={styles.list}>
              {items.map((notif) => (
                <li key={notif.id}>
                  <button
                    onClick={() => handleItemClick(notif)}
                    className={`${styles.item} ${!notif.isRead ? styles.unread : ''}`}
                  >
                    {!notif.isRead && <span className={styles.unreadDot} />}
                    <div className={styles.itemContent}>
                      <p className={styles.message}>{formatMessage(notif)}</p>
                      {notif.createdAt && (
                        <span className={styles.time}>
                          {new Date(notif.createdAt).toLocaleString('tr-TR')}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications
