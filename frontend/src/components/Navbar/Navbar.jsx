import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import SearchBar from '../SearchBar/SearchBar'
import Notifications from '../Notifications/Notifications'
import styles from './Navbar.module.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <img src="/logo.png" alt="KareDefteri" className={styles.logo} />
          <span className={styles.brandText}>KareDefteri</span>
        </Link>

        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>

        <div className={styles.links}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Ana Sayfa
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Paylaş
          </NavLink>

          <NavLink
            to={`/profile/${user?.username}`}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Profilim
          </NavLink>

          <Notifications />

          <button onClick={handleLogout} className={styles.logoutButton}>
            Çıkış
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
