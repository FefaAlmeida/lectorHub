import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        
        <span>Minha Biblioteca</span>
      </div>

      <div className={styles.userSection}>
        <button className={styles.bellBtn} aria-label="Notificações">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        
        <div className={styles.userInfo}>
          <strong>Olá, usuario!</strong>
          <small>Bem-vinda de volta.</small>
        </div>
      </div>
    </header>
  );
}