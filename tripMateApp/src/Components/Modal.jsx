// src/Components/Modal.jsx
import React from 'react';
import './Modal.css'; 

const Modal = ({ onClose, onBack, onNext, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <button className="back-button" onClick={onBack}>←</button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
