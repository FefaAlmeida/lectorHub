import styles from './page.module.css';

export default function Dashboard() {
  return (
    <div className={styles.adminLayout}>
      {/* Menu Lateral Admin */}
      <aside className={styles.sidebar}>
        <a href="/dashboard" className={`${styles.navItem} ${styles.active}`}>Dashboard</a>
        <a href="#" className={styles.navItem}>Acervo de Livros</a>
        <a href="#" className={styles.navItem}>Empréstimos</a>
        <a href="#" className={styles.navItem}>Usuários</a>
        <a href="#" className={styles.navItem}>Relatórios</a>
      </aside>

      {/* Conteúdo Principal */}
      <main className={styles.contentArea}>
        <div className={styles.pageTitle}>
          <h1>Visão Geral do Sistema</h1>
          <p>Painel de controle e monitoramento da biblioteca.</p>
        </div>

        {/* Métrica Rápidas */}
        <section className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span>Empréstimos Ativos</span>
            <strong>142</strong>
          </div>
          <div className={styles.metricCard}>
            <span>Devoluções Atrasadas</span>
            <strong className={styles.alert}>8</strong>
          </div>
          <div className={styles.metricCard}>
            <span>Novos Usuários</span>
            <strong>29</strong>
          </div>
          <div className={styles.metricCard}>
            <span>Reservas Ativas</span>
            <strong>15</strong>
          </div>
        </section>

        {/* Blocos de Ações e Listas */}
        <div className={styles.mainGrid}>
          <section className={styles.cardSection}>
            <h2>Operações do Balcão</h2>
            <div className={styles.actionButtons}>
              <button className={styles.btnPrimary}>+ Novo Empréstimo</button>
              <button className={styles.btnSecondary}>Registrar Devolução</button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Livro</th>
                  <th>Leitor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1984</strong></td>
                  <td>João Silva</td>
                  <td>Hoje, 14:20</td>
                </tr>
                <tr>
                  <td><strong>Dom Casmurro</strong></td>
                  <td>Maria Oliveira</td>
                  <td>Hoje, 11:05</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className={styles.cardSection}>
            <h2>Avisos de Gestão</h2>
            <div className={styles.alertBox}>
              Existem 8 livros com devolução em atraso que exigem notificação.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}