import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Free AI Tools</h1>
      <nav className={styles.nav}>
        <ul className={styles.nav_list}>
          <li>
            <Link href="/" className={styles.nav_list_item}>Home</Link>
          </li>
          <li>
            <Link href="/pages/tools" className={styles.nav_list_item}>Models</Link>
          </li>
          <li>
            <Link href="/pages/about" className={styles.nav_list_item}>About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
