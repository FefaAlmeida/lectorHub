import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <span>© 2024 Sistema de Biblioteca</span>
        <span>Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}