import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchUsers } from '../../services/users'
import styles from './SearchBar.module.css'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()

  // Debounced arama — kullanıcı yazmayı bıraktıktan 300ms sonra istek at
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const data = await searchUsers(query.trim())
        setResults(data || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

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

  const handleSelect = (username) => {
    setQuery('')
    setResults([])
    setOpen(false)
    navigate(`/profile/${username}`)
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Kullanıcı ara..."
        className={styles.input}
      />

      {open && query.trim().length >= 2 && (
        <div className={styles.dropdown}>
          {loading ? (
            <div className={styles.empty}>Aranıyor...</div>
          ) : results.length === 0 ? (
            <div className={styles.empty}>Kullanıcı bulunamadı.</div>
          ) : (
            <ul className={styles.list}>
              {results.map((u) => (
                <li key={u.id}>
                  <button
                    onClick={() => handleSelect(u.username)}
                    className={styles.item}
                  >
                    <div className={styles.avatar}>
                      {u.username?.[0]?.toUpperCase()}
                    </div>
                    <span className={styles.username}>@{u.username}</span>
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

export default SearchBar
