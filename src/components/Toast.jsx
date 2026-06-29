// components/Toast.jsx — Notificaciones visuales reutilizables

import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const iconMap  = { success:'bi-check-circle-fill', error:'bi-x-circle-fill', warning:'bi-exclamation-triangle-fill', info:'bi-info-circle-fill' };
  const colorMap = { success:'#66bb6a', error:'#ef5350', warning:'#ffa726', info:'#4fc3f7' };

  return (
    <div className="toast-dark d-flex align-items-center p-3 mb-2 fade-in-up">
      <i className={`bi ${iconMap[type]||iconMap.info} me-3`} style={{ color: colorMap[type]||colorMap.info, fontSize:'1.1rem' }} />
      <span style={{ fontSize:'0.86rem', flex:1 }}>{message}</span>
      <button className="btn-close btn-close-white ms-2" style={{ fontSize:'0.6rem' }} onClick={onClose} aria-label="Cerrar" />
    </div>
  );
};

export default Toast;
