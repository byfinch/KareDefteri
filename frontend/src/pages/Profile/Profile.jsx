import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { getUserProfile, followUser, unfollowUser } from '../../services/users'
import { getUserPosts } from '../../services/posts'
import PostCard from '../../components/PostCard/PostCard'
import Spinner from '../../components/Spinner/Spinner'
import styles from './Profile.module.css'

function Profile() {
  // URL'den kullanıcı adını al (/profile/melisa gibi)
  const { username } = useParams()
  const { user: currentUser } = useAuth()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [followBusy, setFollowBusy] = useState(false)

  // bu benim profilim mi? (öyleyse "Takip Et" butonu çıkmasın)
  const isOwnProfile = currentUser?.username === username

  // username değiştiğinde profili ve gönderileri çek
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError('')
      try {
        // ikisini paralel çekiyoruz, daha hızlı oluyor
        const [profileData, postsData] = await Promise.all([
          getUserProfile(username),
          getUserPosts(username),
        ])
        setProfile(profileData)
        setPosts(postsData)
      } catch (err) {
        setError(err.response?.data?.message || 'Profil yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  // takip et / takipten çık
  const handleFollowToggle = async () => {
    if (!profile || followBusy) return
    setFollowBusy(true)
    const wasFollowing = profile.isFollowing
    // önce UI'ı güncelle (kullanıcı hızlı tepki görsün), sonra backende yolla
    setProfile({
      ...profile,
      isFollowing: !wasFollowing,
      followerCount: profile.followerCount + (wasFollowing ? -1 : 1),
    })
    try {
      if (wasFollowing) {
        await unfollowUser(username)
      } else {
        await followUser(username)
      }
    } catch {
      // hata olursa eski hale dön
      setProfile({
        ...profile,
        isFollowing: wasFollowing,
        followerCount: profile.followerCount,
      })
    } finally {
      setFollowBusy(false)
    }
  }

  // gönderi silinince listeden kaldır
  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner size={40} />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className={styles.empty}>
        <p>{error || 'Profil bulunamadı.'}</p>
      </div>
    )
  }

  return (
    <div className={styles.profile}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          {profile.username?.[0]?.toUpperCase()}
        </div>
        <div className={styles.info}>
          <h1 className={styles.username}>@{profile.username}</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>{posts.length}</strong>
              <span>gönderi</span>
            </div>
            <a href={`/followers/${username}?tab=followers`} className={styles.stat}>
              <strong>{profile.followerCount || 0}</strong>
              <span>takipçi</span>
            </a>
            <a href={`/followers/${username}?tab=following`} className={styles.stat}>
              <strong>{profile.followingCount || 0}</strong>
              <span>takip</span>
            </a>
          </div>
          {/* kendi profilimde takip butonu olmasın */}
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className={
                profile.isFollowing ? styles.unfollowButton : styles.followButton
              }
              disabled={followBusy}
            >
              {profile.isFollowing ? 'Takipten Çık' : 'Takip Et'}
            </button>
          )}
        </div>
      </header>

      {posts.length === 0 ? (
        <div className={styles.emptyPosts}>
          <p>Henüz gönderi yok.</p>
        </div>
      ) : (
        <div className={styles.feed}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handlePostDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
