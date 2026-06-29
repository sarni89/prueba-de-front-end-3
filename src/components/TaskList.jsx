// components/TaskList.jsx — Lista de misiones con búsqueda, filtros y ordenamiento

import React, { useState, useMemo } from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onToggle, onEdit, onDelete, loading }) => {
  const [search, setSearch]               = useState('');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy]               = useState('createdAt');

  const filteredTasks = useMemo(() => {
    let r = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    }
    if (filterStatus === 'pending') r = r.filter(t => !t.completed);
    if (filterStatus === 'done')    r = r.filter(t => t.completed);
    if (filterStatus === 'local')   r = r.filter(t => t.isLocal);
    if (filterPriority !== 'all')   r = r.filter(t => t.priority === filterPriority);

    r.sort((a, b) => {
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'priority') {
        const o = { high: 0, medium: 1, low: 2 };
        return (o[a.priority] ?? 1) - (o[b.priority] ?? 1);
      }
      if (sortBy === 'title')   return a.title.localeCompare(b.title, 'es');
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
    return r;
  }, [tasks, search, filterStatus, filterPriority, sortBy]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border spinner-gold mb-3" role="status" />
        <p style={{ color: 'var(--text-muted)' }}>Cargando misiones desde el servidor...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Controles */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-4">
          <div className="search-wrapper">
            <i className="bi bi-search search-icon" />
            <input
              type="search"
              className="form-control form-control-dark search-input"
              placeholder="Buscar misiones..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              maxLength={100}
              aria-label="Buscar misiones"
            />
          </div>
        </div>
        <div className="col-6 col-md-3">
          <select className="form-control form-control-dark" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Todas</option>
            <option value="pending">Activas</option>
            <option value="done">Completadas</option>
            <option value="local">Creadas por mí</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select className="form-control form-control-dark" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="all">Todo rango</option>
            <option value="high">S-Rank</option>
            <option value="medium">A-Rank</option>
            <option value="low">B-Rank</option>
          </select>
        </div>
        <div className="col-12 col-md-2">
          <select className="form-control form-control-dark" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="createdAt">Más reciente</option>
            <option value="priority">Rango</option>
            <option value="title">A–Z</option>
            <option value="dueDate">Vencimiento</option>
          </select>
        </div>
      </div>

      {(search || filterStatus !== 'all' || filterPriority !== 'all') && (
        <div className="mb-3">
          <small style={{ color: 'var(--text-muted)' }}>
            <i className="bi bi-funnel me-1" />
            {filteredTasks.length} misión{filteredTasks.length !== 1 ? 'es' : ''}
            {search && <> para "<strong style={{ color: 'var(--text-secondary)' }}>{search}</strong>"</>}
          </small>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{search ? '🔍' : '⚔️'}</div>
          <h6 style={{ color: 'var(--text-secondary)', fontFamily: 'Cinzel, serif' }}>
            {search ? 'Sin resultados' : 'El tablón de misiones está vacío'}
          </h6>
          <p style={{ fontSize: '0.83rem' }}>
            {search ? 'Intenta otros términos.' : 'Crea tu primera misión en el formulario superior.'}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
