import React from 'react';
import './Modal.css'; // 필요한 스타일 추가

const Modal = ({ isOpen, title, children, onClose, onNext, onPrevious, hasNext, hasPrevious }) => {
  if (!isOpen) return null; // 모달이 열려 있지 않으면 렌더링하지 않음

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          {hasPrevious && <button onClick={onPrevious}>이전</button>}
          {hasNext && <button onClick={onNext}>다음</button>}
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
