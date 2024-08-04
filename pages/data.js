import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import tableStyles from '../styles/Table.module.css';
import loaderStyles from '../styles/Loader.module.css';
import Modal from '../components/Modal';
import modalStyles from '../styles/Modal.module.css';

const DataPage = ({ session }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [winsData, setWinsData] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching user data...');
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}`);
        console.log('User data fetched:', userResponse.data);
        setData(userResponse.data);
        setFilteredData(userResponse.data);

        console.log('Fetching wins data...');
        const winsResponse = await axios.get(`${process.env.NEXT_PUBLIC_GIVEAWAY_API_URL}`);
        console.log('Wins data fetched:', winsResponse.data);
        setWinsData(winsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const searchLower = searchTerm.toLowerCase();
    const result = data.filter(user =>
      user.id.toLowerCase().includes(searchLower) ||
      user.stakeId.toLowerCase().includes(searchLower) ||
      user.kickUsername.toLowerCase().includes(searchLower)
    );
    setFilteredData(result);
  }, [searchTerm, data]);

  useEffect(() => {
    const sortedData = [...filteredData].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.age - b.age
        : b.age - a.age;
    });
    setFilteredData(sortedData);
  }, [sortOrder]);

  const handleSort = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (error) {
    return <div className={tableStyles.error}>Error: {error}</div>;
  }

  if (!data.length) {
    return (
      <div className={loaderStyles.loader}>
      </div>
    );
  }

  return (
    <div className={tableStyles.tableContainer}>
    <div className={tableStyles.header}>
    <Image
          src="/logo.png"
          alt="ELRoyal Logo"
          className={tableStyles.logo}
          width={100}
          height={100}
        />
      <h1 className={tableStyles.pageTitle}>ELRoyal Forms | Webview</h1>
    </div>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={tableStyles.searchInput}
      />
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>ID</th>
              <th className={tableStyles.th}>Age
                <button onClick={handleSort} className={tableStyles.sortButton}>
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th className={tableStyles.th}>Country</th>
              <th className={tableStyles.th}>Stake ID</th>
              <th className={tableStyles.th}>Kick Username</th>
              <th className={tableStyles.th}>Reason</th>
              <th className={tableStyles.th}>Date Time</th>
              <th className={tableStyles.th}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? tableStyles.trEven : tableStyles.trHover}
              >
                <td className={tableStyles.td}>{user.id}</td>
                <td className={tableStyles.td}>{user.age}</td>
                <td className={tableStyles.td}>{user.country}</td>
                <td className={tableStyles.td}>
                  <a
                    href={`https://stake.com/casino/games/crash?name=${encodeURIComponent(user.stakeId)}&modal=user`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={tableStyles.stakeLink}
                  >
                    {user.stakeId}
                  </a>
                </td>
                <td className={tableStyles.td}>
                  <a
                    href={`https://kick.com/${user.kickUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={tableStyles.kickLink}
                  >
                    {user.kickUsername}
                  </a>
                </td>
                <td className={tableStyles.td}>{user.reason}</td>
                <td className={tableStyles.td}>{new Date(user.dateTime).toLocaleString()}</td>
                <td className={tableStyles.td}>
                  <button className={tableStyles.iconButton} onClick={() => openModal(user)}>
                    <i className="fa-solid fa-circle-info"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={isModalOpen} onClose={closeModal} title="User Wins">
        {selectedUser && (
          <>
            <p>ID: {selectedUser.id}</p>
            <p>Total Wins: {winsData[selectedUser.id] ? winsData[selectedUser.id].totalWins : 0}</p>
            <h3>Giveaways:</h3>
            <ul className={modalStyles.giveawayList}>
              {winsData[selectedUser.id]?.giveaways.map((giveaway, index) => (
                <li key={index} className={modalStyles.giveawayItem}>
                  {giveaway.giveawayName} - {new Date(giveaway.date).toLocaleString()}
                </li>
              )) || <li>No giveaways won.</li>}
            </ul>
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

export default DataPage;
