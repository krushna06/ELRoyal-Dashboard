import Link from 'next/link';
import styles from '../styles/Welcome.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/data" className={styles.navLink}>
        Data
      </Link>
      <Link href="/giveaways" className={styles.navLink}>
        Giveaways
      </Link>
    </nav>
  );
};

export default Navbar;
