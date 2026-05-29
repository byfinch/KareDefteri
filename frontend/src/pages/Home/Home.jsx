import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeed } from '../../services/posts'
import PostCard from '../../components/PostCard/PostCard'
import Spinner from '../../components/Spinner/Spinner'
import styles from './Home.module.css'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // sayfa açıldığında takip edilenlerin gönderilerini çek
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getFeed()
        setPosts(data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Ana Sayfa yüklenemedi. Biraz beklesen mi?'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [])

  // bir gönderi silinince listeden çıkar (PostCard üst component'e haber veriyor)
  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner size={40} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.empty}>
        <p>{error}</p>
      </div>
    )
  }

  // hiç gönderi yoksa: ya takip ettiği yok ya takip ettikleri paylaşmamış
  if (posts.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Akışın boş</h2>
        <p>Henüz takip ettiğin biri yok veya kimse gönderi paylaşmamış.</p>
        <Link to="/create" className={styles.cta}>
          İlk gönderini paylaş
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.feed}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  )
}

export default Home
