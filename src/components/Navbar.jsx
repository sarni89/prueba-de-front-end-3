// components/Navbar.jsx — Barra de navegación temática JRPG

import React from 'react';

const Navbar = ({ totalTasks, pendingTasks }) => {
  return (
    <nav className="navbar-taskmaster">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-between">
          {/* Brand */}
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-shield-shaded" style={{ color: '#F5C518', fontSize: '1.3rem' }} />
            <span className="navbar-brand-text">TaskMaster</span>
            <span className="navbar-badge">JRPG</span>
          </div>

          {/* Stats */}
          <div className="d-flex align-items-center gap-4">
            <div className="d-none d-md-flex align-items-center gap-2">
              <span className="pulse-dot yellow" />
              <small style={{ color: '#9090c0', fontSize: '0.78rem' }}>
                <strong style={{ color: '#F5C518' }}>{pendingTasks}</strong> misiones activas
              </small>
            </div>
            <div className="d-none d-md-flex align-items-center gap-2">
              <span className="pulse-dot green" />
              <small style={{ color: '#9090c0', fontSize: '0.78rem' }}>
                <strong style={{ color: '#66bb6a' }}>{totalTasks}</strong> en el grimorio
              </small>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
