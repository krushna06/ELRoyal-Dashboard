import React from 'react';
import tableStyles from '../styles/Table.module.css';

const TournamentTable = ({ tournaments, openModal, formatDate }) => (
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
);

export default TournamentTable;
