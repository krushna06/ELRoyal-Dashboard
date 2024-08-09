import { useState, useEffect } from 'react';
import axios from 'axios';
import tableStyles from '../styles/Table.module.css';
import loaderStyles from '../styles/Loader.module.css';
import GiveawaysModal from '../components/GiveawaysModal';

const GiveawaysPage = () => {
  const [giveaways, setGiveaways] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGiveaway, setSelectedGiveaway] = useState(null);

  useEffect(() => {
    const fetchGiveaways = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_GIVEAWAY_DB_API_URL}`);
        setGiveaways(response.data);
      } catch (error) {
        console.error('Error fetching giveaways:', error);
        setError('Failed to load giveaways.');
      }
    };

    fetchGiveaways();
  }, []);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const sortedGiveaways = [...giveaways].sort((a, b) => b.endAt - a.endAt);

  const openModal = (giveaway) => {
    setSelectedGiveaway(giveaway);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGiveaway(null);
  };

  if (error) {
    return <div className={tableStyles.error}>{error}</div>;
  }

  if (giveaways.length === 0) {
    return (
      <div className={loaderStyles.loader}>
      </div>
    );
  }

  return (
    <div className={tableStyles.tableContainer}>
      <h1 className={tableStyles.pageTitle}>Active Giveaways</h1>
      <br></br>
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>Prize</th>
              <th className={tableStyles.th}>Start Date</th>
              <th className={tableStyles.th}>End Date</th>
              <th className={tableStyles.th}>Winner Count</th>
              <th className={tableStyles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedGiveaways.map((giveaway, index) => (
              <tr
                key={giveaway.messageId}
                className={index % 2 === 0 ? tableStyles.trEven : tableStyles.trHover}
              >
                <td className={tableStyles.td}>{giveaway.prize}</td>
                <td className={tableStyles.td}>{formatDateTime(giveaway.startAt)}</td>
                <td className={tableStyles.td}>{formatDateTime(giveaway.endAt)}</td>
                <td className={tableStyles.td}>
                  {giveaway.winnerCount}
                  <button
                    className={tableStyles.iconButton}
                    onClick={() => openModal(giveaway)}
                    aria-label="View Winner IDs"
                    style={{ marginLeft: '8px' }}
                  >
                    <i className="fa-solid fa-circle-info"></i>
                  </button>
                </td>
                <td className={tableStyles.td}>
                  {giveaway.ended ? 'Ended' : 'Ongoing'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedGiveaway && (
        <GiveawaysModal
          show={isModalOpen}
          onClose={closeModal}
          giveaway={selectedGiveaway}
        />
      )}
    </div>
  );
};

export default GiveawaysPage;
