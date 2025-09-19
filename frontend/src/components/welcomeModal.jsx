import React from 'react';

const WelcomeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="welcome-modal" onClick={e => e.stopPropagation()}>
        <div className="welcome-icon">🎉</div>
        <h2>¡Registro Exitoso!</h2>
        <p>Bienvenido a <strong>BogotaTuris</strong></p>
        <p>¡Descubre los mejores lugares de nuestra hermosa ciudad!</p>
        <button onClick={onClose}>
          Comenzar mi aventura
        </button>
      </div>
    </div>
  );
};
export default WelcomeModal;