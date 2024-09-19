'use client';

import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>ZetaChain ZRC-20</h1>
      </header>
      <main className={styles.main}>
        
      </main>
      <footer className={styles.footer}>
        <a
          href="https://www.zetachain.com/docs/developers/tokens/zrc20/#summary"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.documentationLink}
        >
          View Documentation
        </a>
      </footer>
    </div>
  );
}
