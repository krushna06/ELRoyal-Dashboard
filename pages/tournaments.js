import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import tableStyles from '../styles/Table.module.css';
import loaderStyles from '../styles/Loader.module.css';
import { getSession } from 'next-auth/react';
import TournamentTable from '../components/TournamentTable';
import TournamentModal from '../components/TournamentModal';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
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

  const openModal = (tournament) => {
    setSelectedTournament(tournament);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTournament(null);
  };

  const goToWelcomePage = () => {
    router.push('/welcome');
  };

  if (error) {
    return <div className={tableStyles.error}>{error}</div>;
  }

  if (tournaments.length === 0) {
    return <div className={loaderStyles.loader}></div>;
  }

  return (
    <div className={tableStyles.tableContainer}>
      <button className={tableStyles.welcomeButton} onClick={goToWelcomePage}>
        Home
      </button>
      <h1 className={tableStyles.pageTitle}>ELRoyal | Tournaments</h1>
      <br />
      <TournamentTable 
        tournaments={tournaments} 
        openModal={openModal} 
        formatDate={formatDate} 
      />
      <TournamentModal 
        isModalOpen={isModalOpen} 
        closeModal={closeModal} 
        selectedTournament={selectedTournament} 
      />
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
