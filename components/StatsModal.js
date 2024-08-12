import React, { useState, useEffect } from 'react';
import modalStyles from '../styles/StatsModal.module.css';

const Modal = ({ show, onClose, title, children }) => {
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
        <h2 className={modalStyles.title}>{title}</h2>
        <button className={modalStyles.closeButton} onClick={handleOverlayClick}>
          &times;
        </button>
        <div className={modalStyles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
