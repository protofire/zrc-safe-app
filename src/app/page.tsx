'use client';

import WithdrawalForm from '@/components/WithdrawalForm';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>ZRC-20 Withdrawal</h1>
      </header>
      <main className={styles.main}>
        <WithdrawalForm />
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
