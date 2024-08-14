import React from 'react';
import Modal from './StatsModal';
import tableStyles from '../styles/Table.module.css';

const TournamentModal = ({ isModalOpen, closeModal, selectedTournament }) => (
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
);

export default TournamentModal;
