import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import styles from './AdminLayout.module.css'

function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link to="/admin" className={styles.brand}>
            <img src="/logo.png" alt="KareDefteri" className={styles.logo} />
            <div className={styles.brandTextWrapper}>
              <span className={styles.brandText}>KareDefteri</span>
              <span className={styles.adminBadge}>Yönetici Paneli</span>
            </div>
          </Link>

          <div className={styles.right}>
            <span className={styles.username}>@{user?.username}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
