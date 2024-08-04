import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleSignInClick = () => {
    router.push('/auth/signin');
  };

  return (
    <>
      <Head>
        <title>Login to Access Data</title>
        <meta name="description" content="Login to access the data page with your email and password" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button className={styles.button} onClick={handleSignInClick}>
          Login with Email and Password
        </button>
      </main>
    </>
  );
}
