import { getSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import styles from '../styles/Welcome.module.css';

const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Welcome to the Dashboard</h1>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default WelcomePage;
