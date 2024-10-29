// src/Components/Modal.jsx
import React from 'react';
import './Modal.css'; 

const Modal = ({ onClose, onBack, onNext, children, customClass = '' }) => {
  return (
    <div className={`modal-overlay ${customClass}`}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        {/* 뒤로 가기 버튼 조건부 렌더링 */}
        {onBack && (
          <button className="back-button" onClick={onBack}>←</button>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};


export default Modal;
