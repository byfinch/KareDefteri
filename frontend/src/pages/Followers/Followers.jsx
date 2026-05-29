import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getFollowers, getFollowing } from '../../services/users'
import Spinner from '../../components/Spinner/Spinner'
import styles from './Followers.module.css'

function Followers() {
  const { username } = useParams()
  // hangi sekmedeyiz: takipçiler mi takip edilenler mi
  // URL'de ?tab=followers ya da ?tab=following olarak tutuyoruz
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'followers'

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // sekme veya kullanıcı değişince listeyi yeniden çek
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError('')
      try {
        const data =
          tab === 'followers'
            ? await getFollowers(username)
            : await getFollowing(username)
        setUsers(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Liste yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [username, tab])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>@{username}</h1>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'followers' ? styles.activeTab : ''}`}
          onClick={() => setSearchParams({ tab: 'followers' })}
        >
          Takipçiler
        </button>
        <button
          className={`${styles.tab} ${tab === 'following' ? styles.activeTab : ''}`}
          onClick={() => setSearchParams({ tab: 'following' })}
        >
          Takip Edilenler
        </button>
      </div>

      {loading ? (
        <div className={styles.center}>
          <Spinner size={32} />
        </div>
      ) : error ? (
        <div className={styles.empty}>{error}</div>
      ) : users.length === 0 ? (
        <div className={styles.empty}>
          {tab === 'followers' ? 'Henüz takipçi yok.' : 'Henüz kimseyi takip etmiyor.'}
        </div>
      ) : (
        <ul className={styles.list}>
          {users.map((u) => (
            <li key={u.id} className={styles.item}>
              <Link to={`/profile/${u.username}`} className={styles.userLink}>
                <div className={styles.avatar}>
                  {u.username?.[0]?.toUpperCase()}
                </div>
                <span className={styles.username}>@{u.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Followers
