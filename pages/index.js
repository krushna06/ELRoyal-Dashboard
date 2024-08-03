import Head from "next/head";
import { signIn } from "next-auth/react";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Login with Discord</title>
        <meta name="description" content="Login with Discord to access the data page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button onClick={() => signIn("discord")}>
          Login with Discord
        </button>
      </main>
    </>
  );
}
