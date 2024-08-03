import axios from 'axios';
import { useEffect, useState } from 'react';
import tableStyles from '../styles/Table.module.css';

const DataPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await axios.get('https://3000-krushna06-elroyalbot-t1jtrc0y4s9.ws-us115.gitpod.io/api/v1/data');
        console.log('Data fetched:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Data Page</h1>
      <div className={tableStyles.tableContainer}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>ID</th>
              <th className={tableStyles.th}>Age</th>
              <th className={tableStyles.th}>Country</th>
              <th className={tableStyles.th}>Stake ID</th>
              <th className={tableStyles.th}>Kick Username</th>
              <th className={tableStyles.th}>Reason</th>
              <th className={tableStyles.th}>Date Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? tableStyles.trEven : ''}
              >
                <td className={tableStyles.td}>{user.id}</td>
                <td className={tableStyles.td}>{user.age}</td>
                <td className={tableStyles.td}>{user.country}</td>
                <td className={tableStyles.td}>{user.stakeId}</td>
                <td className={tableStyles.td}>{user.kickUsername}</td>
                <td className={tableStyles.td}>{user.reason}</td>
                <td className={tableStyles.td}>{new Date(user.dateTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPage;
