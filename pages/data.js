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
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user, index) => (
            <tr
              key={user.id}
              className={index % 2 === 0 ? tableStyles.trEven : ''}
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
            </tr>
          ))}
        </tbody>
      </table>
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
