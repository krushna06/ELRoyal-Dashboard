import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import tableStyles from '../styles/Table.module.css';
import loaderStyles from '../styles/Loader.module.css';
import { getSession } from 'next-auth/react';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_TOURNAMENT_DB_API_URL}`);
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setError('Failed to load tournaments.');
      }
    };

    fetchTournaments();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const goToWelcomePage = () => {
    router.push('/welcome');
  };

  if (error) {
    return <div className={tableStyles.error}>{error}</div>;
  }

  if (tournaments.length === 0) {
    return (
      <div className={loaderStyles.loader}>
      </div>
    );
  }

  return (
    <div className={tableStyles.tableContainer}>
      <button className={tableStyles.welcomeButton} onClick={goToWelcomePage}>
        Home
      </button>
      <h1 className={tableStyles.pageTitle}>ELRoyal | Tournaments</h1>
      <br></br>
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>Tournament Name</th>
              <th className={tableStyles.th}>Prize</th>
              <th className={tableStyles.th}>Date</th>
              <th className={tableStyles.th}>Number of Registrants</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament) => (
              <tr key={tournament.id}>
                <td className={tableStyles.td}>{tournament.name}</td>
                <td className={tableStyles.td}>{tournament.prize}</td>
                <td className={tableStyles.td}>{formatDate(tournament.endTime)}</td>
                <td className={tableStyles.td}>{tournament.registrations.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default TournamentsPage;
