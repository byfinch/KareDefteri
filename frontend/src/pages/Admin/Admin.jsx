import { useEffect, useState } from 'react'
import {
  getReportedPosts,
  resolveReport,
  getAllUsers,
  banUser,
  unbanUser,
  getStatistics,
} from '../../services/admin'
import Spinner from '../../components/Spinner/Spinner'
import styles from './Admin.module.css'

function Admin() {
  // hangi sekme açık
  const [tab, setTab] = useState('stats')

  return (
    <div className={styles.admin}>
      <header className={styles.header}>
        <h1>Yönetici Paneli</h1>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'stats' ? styles.activeTab : ''}`}
          onClick={() => setTab('stats')}
        >
          İstatistikler
        </button>
        <button
          className={`${styles.tab} ${tab === 'reports' ? styles.activeTab : ''}`}
          onClick={() => setTab('reports')}
        >
          Raporlar
        </button>
        <button
          className={`${styles.tab} ${tab === 'users' ? styles.activeTab : ''}`}
          onClick={() => setTab('users')}
        >
          Kullanıcılar
        </button>
      </div>

      <div className={styles.content}>
        {tab === 'stats' && <StatsTab />}
        {tab === 'reports' && <ReportsTab />}
        {tab === 'users' && <UsersTab />}
      </div>
    </div>
  )
}

// istatistikler sekmesi (genel sayılar + tarih dağılımı + coğrafi)
function StatsTab() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getStatistics()
        setStats(data)
      } catch (err) {
        setError(err.response?.data?.message || 'İstatistikler yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div className={styles.center}><Spinner /></div>
  if (error) return <div className={styles.empty}>{error}</div>
  if (!stats) return <div className={styles.empty}>Veri bulunamadı.</div>

  // coğrafi dağılımı bar chart yapacağız
  // en büyük değeri bulup diğerleri buna oranlanacak
  const countries = stats.geoDistribution || []
  const maxCountry = countries.reduce((m, c) => Math.max(m, c.count || 0), 0) || 1

  return (
    <div className={styles.statsContainer}>
      <section>
        <h2 className={styles.sectionTitle}>Genel Sayılar</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Toplam Kullanıcı</div>
            <div className={styles.statValue}>{stats.totalUsers || 0}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Aktif Kullanıcı</div>
            <div className={styles.statValue}>{stats.activeUsers || 0}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Banlı Kullanıcı</div>
            <div className={styles.statValue}>{stats.bannedUsers || 0}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Toplam Gönderi</div>
            <div className={styles.statValue}>{stats.totalPosts || 0}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Aktif Gönderi</div>
            <div className={styles.statValue}>{stats.activePosts || 0}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Bekleyen Rapor</div>
            <div className={styles.statValue}>{stats.pendingReports || 0}</div>
          </div>
        </div>
      </section>

      {stats.postsByDateRange && (
        <section>
          <h2 className={styles.sectionTitle}>Tarih Aralığına Göre Gönderiler</h2>
          <div className={styles.dateGrid}>
            <div className={styles.dateCard}>
              <div className={styles.dateLabel}>Bugün</div>
              <div className={styles.dateValue}>{stats.postsByDateRange.today || 0}</div>
            </div>
            <div className={styles.dateCard}>
              <div className={styles.dateLabel}>Bu Hafta</div>
              <div className={styles.dateValue}>{stats.postsByDateRange.thisWeek || 0}</div>
            </div>
            <div className={styles.dateCard}>
              <div className={styles.dateLabel}>Bu Ay</div>
              <div className={styles.dateValue}>{stats.postsByDateRange.thisMonth || 0}</div>
            </div>
            <div className={styles.dateCard}>
              <div className={styles.dateLabel}>Bu Yıl</div>
              <div className={styles.dateValue}>{stats.postsByDateRange.thisYear || 0}</div>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className={styles.sectionTitle}>Coğrafi Dağılım (Ülke Bazlı)</h2>
        {countries.length === 0 ? (
          <div className={styles.empty}>Coğrafi veri yok.</div>
        ) : (
          <ul className={styles.geoList}>
            {countries.map((c) => (
              <li key={c.country} className={styles.geoItem}>
                <div className={styles.geoLabel}>
                  <span className={styles.geoCountry}>{c.country}</span>
                  <span className={styles.geoCount}>{c.count}</span>
                </div>
                <div className={styles.geoBarBg}>
                  <div
                    className={styles.geoBar}
                    style={{ width: `${(c.count / maxCountry) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

// raporlar sekmesi: raporlanan gönderiler ve gerekçeleri
function ReportsTab() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getReportedPosts()
        setReports(data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Raporlar yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  // aynı gönderiye gelen raporları tek kartta toplayalım
  // (örn. 3 farklı kişi aynı gönderiyi rapor ettiyse tek yerde gösterilsin)
  const groupedReports = (() => {
    const groups = new Map()
    reports.forEach((r) => {
      const postId = r.post?.id || r.postId
      if (!postId) return
      if (!groups.has(postId)) {
        groups.set(postId, {
          post: r.post,
          reports: [],
        })
      }
      groups.get(postId).reports.push(r)
    })
    return Array.from(groups.values())
  })()

  // bir gönderiye gelen tüm raporları aynı anda işle
  const handleResolveAll = async (postId, action) => {
    const group = groupedReports.find((g) => g.post?.id === postId)
    if (!group) return
    try {
      // her raporu paralel olarak backend'e bildir
      await Promise.all(
        group.reports.map((r) => resolveReport(r.id, action))
      )
      // sonra listeden çıkar
      setReports((prev) => prev.filter((r) => r.post?.id !== postId))
    } catch {
      alert('İşlem başarısız.')
    }
  }

  if (loading) return <div className={styles.center}><Spinner /></div>
  if (error) return <div className={styles.empty}>{error}</div>
  if (groupedReports.length === 0) {
    return <div className={styles.empty}>Bekleyen rapor yok.</div>
  }

  return (
    <ul className={styles.list}>
      {groupedReports.map((group) => (
        <li key={group.post.id} className={styles.reportItem}>
          <div className={styles.reportInfo}>
            <div className={styles.reportMeta}>
              <strong>@{group.post.author?.username}</strong>
              <span className={styles.reportCountBadge}>
                {group.reports.length} kez raporlandı
              </span>
            </div>

            {group.post.imageUrl && (
              <img
                src={group.post.imageUrl}
                alt="Raporlanan gönderi"
                className={styles.reportImage}
              />
            )}

            <div>
              <strong className={styles.reasonsTitle}>Raporlama Gerekçeleri:</strong>
              <ul className={styles.reasonsList}>
                {group.reports.map((r) => (
                  <li key={r.id} className={styles.reasonItem}>
                    <div className={styles.reasonHeader}>
                      <span className={styles.reasonReporter}>
                        @{r.reporter?.username || 'bilinmeyen'}
                      </span>
                      <span className={styles.reasonDate}>
                        {r.createdAt && new Date(r.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <p className={styles.reasonText}>{r.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.reportActions}>
            <button
              onClick={() => handleResolveAll(group.post.id, 'hide')}
              className={styles.dangerButton}
            >
              Gönderiyi Gizle
            </button>
            <button
              onClick={() => handleResolveAll(group.post.id, 'ignore')}
              className={styles.neutralButton}
            >
              Tüm Raporları Yok Say
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

// kullanıcılar sekmesi: ban/unban işlemleri
function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllUsers()
        setUsers(data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Kullanıcılar yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleBan = async (userId, duration) => {
    try {
      await banUser(userId, duration)
      // UI'da banlı işaretle (verisi silinmiyor)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: true } : u))
      )
    } catch {
      alert('Banlama başarısız.')
    }
  }

  const handleUnban = async (userId) => {
    try {
      await unbanUser(userId)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: false } : u))
      )
    } catch {
      alert('Ban kaldırma başarısız.')
    }
  }

  if (loading) return <div className={styles.center}><Spinner /></div>
  if (error) return <div className={styles.empty}>{error}</div>
  if (users.length === 0) return <div className={styles.empty}>Kullanıcı bulunamadı.</div>

  return (
    <ul className={styles.list}>
      {users.map((u) => (
        <li key={u.id} className={styles.userItem}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{u.username?.[0]?.toUpperCase()}</div>
            <div>
              <div className={styles.username}>@{u.username}</div>
              <div className={styles.userEmail}>{u.email}</div>
            </div>
            {u.isBanned && <span className={styles.bannedBadge}>BANLI</span>}
          </div>
          <div className={styles.userActions}>
            {u.isBanned ? (
              <button onClick={() => handleUnban(u.id)} className={styles.neutralButton}>
                Banı Kaldır
              </button>
            ) : (
              <>
                <button onClick={() => handleBan(u.id, 7)} className={styles.warningButton}>
                  7 Gün Ban
                </button>
                <button
                  onClick={() => handleBan(u.id, 'permanent')}
                  className={styles.dangerButton}
                >
                  Kalıcı Ban
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Admin
