import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import tableStyles from '../styles/Table.module.css';
import loaderStyles from '../styles/Loader.module.css';

const DataPage = ({ session }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [winsData, setWinsData] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}`);
        console.log('Data fetched:', response.data);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    const fetchWins = async () => {
      try {
        console.log('Fetching wins data...');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_GIVEAWAY_API_URL}`);
        console.log('Wins data fetched:', response.data);
        setWinsData(response.data);
      } catch (error) {
        console.error('Error fetching wins data:', error);
        setError(error.message);
      }
    };

    fetchData();
    fetchWins();
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

  const handleIconClick = (id) => {
    setSelectedId(id);
  };

  if (error) {
    return <div className={tableStyles.error}>Error: {error}</div>;
  }

  if (!data.length) {
    return (
      <div className={loaderStyles.loader}></div>
    );
  }

  return (
    <div className={tableStyles.tableContainer}>
      <div className={tableStyles.header}>
        <img
          src="https://i.postimg.cc/527RmSwt/logo.png"
          alt="ELRoyal Logo"
          className={tableStyles.logo}
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
              <th className={tableStyles.th}>Wins</th> {/* Added Wins column */}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr
                key={user.id}
                className={`${index % 2 === 0 ? tableStyles.trEven : tableStyles.trHover}`}
              >
                <td className={tableStyles.td}>
                  {user.id}
                  <button className={tableStyles.iconButton} onClick={() => handleIconClick(user.id)}>
                    <i className="fa-solid fa-circle-info"></i>
                  </button>
                </td>
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
                  {winsData[user.id] ? `${winsData[user.id].totalWins} wins` : 'No data'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedId && (
        <div className={tableStyles.modalOverlay} onClick={() => setSelectedId(null)}>
          <div className={tableStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Wins for ID: {selectedId}</h2>
            {winsData[selectedId] ? (
              <ul>
                {winsData[selectedId].giveaways.map((giveaway, index) => (
                  <li key={index}>
                    <strong>{giveaway.giveawayName}</strong> - {new Date(giveaway.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );  
};

// Server-side function to check for user authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    // Redirect to the sign-in page if not authenticated
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
