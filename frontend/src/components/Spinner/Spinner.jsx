import styles from './Spinner.module.css'

function Spinner({ size = 32 }) {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Yükleniyor"
    />
  )
}

export default Spinner
