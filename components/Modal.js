import React from 'react';
import modalStyles from '../styles/Modal.module.css';

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modal}>
        <h2 className={modalStyles.title}>{title}</h2>
        <button className={modalStyles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={modalStyles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
