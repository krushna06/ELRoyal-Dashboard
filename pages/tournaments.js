// pages/tournaments.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import tableStyles from '../styles/Table.module.css';
import loaderStyles from '../styles/Loader.module.css';
import { getSession } from 'next-auth/react';
import Modal from '../components/StatsModal';

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
      <br />
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>Tournament Name</th>
              <th className={tableStyles.th}>Prize</th>
              <th className={tableStyles.th}>Date</th>
              <th className={tableStyles.th}>Number of Registrants</th>
              <th className={tableStyles.th}>Details</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament) => (
              <tr key={tournament.id}>
                <td className={tableStyles.td}>{tournament.name}</td>
                <td className={tableStyles.td}>{tournament.prize}</td>
                <td className={tableStyles.td}>{formatDate(tournament.endTime)}</td>
                <td className={tableStyles.td}>{tournament.registrations.length}</td>
                <td className={tableStyles.td}>
                  <button
                    className={tableStyles.iconButton}
                    onClick={() => openModal(tournament)}
                    aria-label="View Tournament Details"
                    style={{ marginLeft: '8px' }}
                  >
                    <i className="fa-solid fa-circle-info"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={isModalOpen}
        onClose={closeModal}
        title={selectedTournament ? selectedTournament.name : 'Tournament Details'}
      >
        {selectedTournament && (
          <>
            <p><strong>Game:</strong> {selectedTournament.gameName}</p>
            <p><strong>Creator:</strong> {selectedTournament.creator}</p>
            <p><strong>Duration:</strong> {selectedTournament.durationText}</p>
            <p><strong>Prize:</strong> {selectedTournament.prize}</p>
            <p><strong>Number of Games:</strong> {selectedTournament.numberOfGames}</p>
            <p><strong>End Time:</strong> {new Date(selectedTournament.endTime).toLocaleString()}</p>
            <p><strong>Selected Registrant:</strong> {selectedTournament.selectedRegistrant ? 
              `${selectedTournament.selectedRegistrant.gamertag} (Clan: ${selectedTournament.selectedRegistrant.clanName})` : 
              'None'}
            </p>
            <p><strong>Winner:</strong> {selectedTournament.winner ? selectedTournament.winner : 'None'}</p>
            <h3>Registrations:</h3>
            <ol className={tableStyles.registrationList}>
              {selectedTournament.registrations.map((reg, index) => (
                <li key={index}>
                  {reg.gamertag} (Clan: {reg.clanName})
                </li>
              ))}
            </ol>
          </>
        )}
      </Modal>
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
