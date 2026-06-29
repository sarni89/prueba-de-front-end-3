// components/TaskCard.jsx — Tarjeta de misión individual con temática JRPG

import React from 'react';

const PRIORITY_CONFIG = {
  high:   { label: 'S-Rank', color: '#ef5350', icon: 'bi-arrow-up-circle-fill' },
  medium: { label: 'A-Rank', color: '#ffa726', icon: 'bi-dash-circle-fill' },
  low:    { label: 'B-Rank', color: '#66bb6a', icon: 'bi-arrow-down-circle-fill' },
};

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const formatDate = (d) => {
    if (!d) return null;
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('es-CL', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch { return null; }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date(); today.setHours(0,0,0,0);
    return new Date(task.dueDate + 'T00:00:00') < today;
  };

  return (
    <div
      className={`task-card fade-in-up priority-${task.priority || 'medium'} ${task.completed ? 'completed' : ''}`}
      role="article"
      aria-label={`Misión: ${task.title}`}
    >
      <div className="d-flex align-items-start gap-3">
        {/* Checkbox */}
        <div style={{ paddingTop: 2 }}>
          <input
            type="checkbox"
            className="form-check-input"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
        </div>

        {/* Contenido */}
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <span
              className="task-title"
              style={{
                fontWeight: 600,
                fontSize: '0.92rem',
                color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                wordBreak: 'break-word',
              }}
            >
              {task.title}
            </span>

            {task.isLocal && (
              <span className="badge-status badge-api">
                <i className="bi bi-person-fill me-1" style={{ fontSize: '0.65rem' }} />
                local
              </span>
            )}
            <span className="badge-status" style={{
              background: `${priority.color}18`,
              color: priority.color,
              border: `1px solid ${priority.color}35`,
            }}>
              <i className={`bi ${priority.icon} me-1`} style={{ fontSize: '0.65rem' }} />
              {priority.label}
            </span>
            {task.completed
              ? <span className="badge-status badge-done">Completada</span>
              : <span className="badge-status badge-pending">Activa</span>
            }
          </div>

          {task.description && (
            <p style={{ fontSize: '0.81rem', color: 'var(--text-muted)', marginBottom: '0.35rem', lineHeight: 1.5 }}>
              {task.description}
            </p>
          )}

          <div className="d-flex flex-wrap gap-3" style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
            {task.category && (
              <span>
                <i className="bi bi-tag-fill me-1" style={{ color: '#ce93d8' }} />
                {task.category}
              </span>
            )}
            {task.dueDate && (
              <span style={{ color: isOverdue() ? '#ef5350' : 'inherit' }}>
                <i className="bi bi-calendar3 me-1" />
                {formatDate(task.dueDate)}
                {isOverdue() && ' ⚠ Vencida'}
              </span>
            )}
            {task.createdAt && (
              <span>
                <i className="bi bi-clock me-1" />
                {new Date(task.createdAt).toLocaleDateString('es-CL')}
              </span>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="d-flex gap-1" style={{ flexShrink: 0 }}>
          <button
            className="btn btn-danger-ghost"
            onClick={() => onEdit(task)}
            aria-label={`Editar misión "${task.title}"`}
            title="Editar"
          >
            <i className="bi bi-pencil" style={{ fontSize: '0.82rem' }} />
          </button>
          <button
            className="btn btn-danger-ghost"
            onClick={() => onDelete(task.id)}
            aria-label={`Eliminar misión "${task.title}"`}
            title="Eliminar"
          >
            <i className="bi bi-trash3" style={{ fontSize: '0.82rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
