// components/StatsBar.jsx — Panel de estadísticas con temática de aventura JRPG

import React from 'react';

const StatsBar = ({ tasks }) => {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;
  const local     = tasks.filter(t => t.isLocal).length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { value: total,     label: 'Misiones',       color: '#4fc3f7', icon: 'bi-book-half' },
    { value: pending,   label: 'En Progreso',     color: '#F5C518', icon: 'bi-hourglass-split' },
    { value: completed, label: 'Completadas',     color: '#66bb6a', icon: 'bi-trophy-fill' },
    { value: local,     label: 'Creadas por ti',  color: '#ce93d8', icon: 'bi-person-badge-fill' },
  ];

  return (
    <div className="mb-4">
      <div className="row g-3 mb-3">
        {stats.map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="stat-card">
              <i className={`bi ${s.icon} mb-1`} style={{ color: s.color, fontSize: '1.1rem', display: 'block' }} />
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de progreso de aventura */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '12px 16px',
      }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <i className="bi bi-bar-chart-steps me-2" style={{ color: '#F5C518' }} />
            Progreso de la Aventura
          </small>
          <small style={{ color: '#F5C518', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>{pct}%</small>
        </div>
        <div className="progress" style={{ height: 7, borderRadius: 10 }}>
          <div
            className="progress-bar"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #ce93d8, #F5C518)',
              borderRadius: 10,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
