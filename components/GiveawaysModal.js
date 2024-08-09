import React, { useState, useEffect } from 'react';
import modalStyles from '../styles/Modal.module.css';

const GiveawaysModal = ({ show, onClose, giveaway }) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else if (!show && isVisible) {
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 300);
    }
  }, [show, isVisible]);

  if (!isVisible) return null;

  const handleOverlayClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClose();
    }, 300);
  };

  return (
    <div className={modalStyles.overlay} onClick={handleOverlayClick}>
      <div
        className={`${modalStyles.modal} ${isClosing ? modalStyles.modalClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={modalStyles.title}>Winner IDs for {giveaway?.prize}</h2>
        <button className={modalStyles.closeButton} onClick={handleOverlayClick}>
          &times;
        </button>
        <div className={modalStyles.content}>
          <p>Total Winners: {giveaway?.winnerCount}</p>
          <ol>
            {giveaway?.winnerIds && giveaway.winnerIds.length > 0 ? (
              giveaway.winnerIds.map((id, index) => (
                <li key={index}>Winner ID: {id}</li>
              ))
            ) : (
              <li>No winner IDs available.</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GiveawaysModal;
