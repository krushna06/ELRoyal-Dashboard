import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import loaderStyles from '../styles/Loader.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth/signin');
  }, [router]);

  return (
    <>
      <Head>
        <title>Login to Access Data</title>
        <meta name="description" content="Login to access the data page with your email and password" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
      <div className={loaderStyles.loader}>
      </div>
      </main>
    </>
  );
}
