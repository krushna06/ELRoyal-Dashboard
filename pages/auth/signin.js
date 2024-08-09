import { signIn } from 'next-auth/react';
import { useState } from 'react';
import styles from '../../styles/Signin.module.css';

const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

const sendDiscordNotification = async (email) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const formattedTimestamp = `<t:${timestamp}:F>`;

  const message = {
    content: `User:${email} logged in at ${formattedTimestamp}`,
  };

  console.log('Webhook URL:', DISCORD_WEBHOOK_URL);
  console.log('Message:', message);

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Failed to send Discord notification:', text);
    } else {
      console.log('Message sent successfully'); // Debugging
    }
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
};

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      alert(result.error);
    } else {
      await sendDiscordNotification(email);
      window.location.href = '/welcome'; // Redirect to the /welcome page
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={styles.title}>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.inputGroupLabel}>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputGroupInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputGroupLabel}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputGroupInput}
            />
          </div>
          <button type="submit" className={styles.button}>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
