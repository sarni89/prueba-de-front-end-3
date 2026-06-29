// App.jsx — TaskMaster JRPG
// SPA con React + API REST + CRUD completo + Local Storage
// Evaluación Sumativa 3 — Ingeniería en Informática
//
// Uso de IA: prompts documentados en PROMPTS.md
// Hooks: useState, useEffect, useCallback

import React, { useState, useEffect, useCallback } from 'react';
import Navbar    from './components/Navbar';
import StatsBar  from './components/StatsBar';
import TaskForm  from './components/TaskForm';
import TaskList  from './components/TaskList';
import PostsView from './components/PostsView';
import Toast     from './components/Toast';

const LOCAL_KEY = 'taskmaster_jrpg_v1';
const API_URL   = 'https://jsonplaceholder.typicode.com/todos?_limit=20';

const generateId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};

const saveToStorage = (tasks) => {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks)); } catch {}
};

const App = () => {
  const [tasks,       setTasks]       = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab,   setActiveTab]   = useState('tasks');
  const [loading,     setLoading]     = useState(false);
  const [toasts,      setToasts]      = useState([]);
  const [apiError,    setApiError]    = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Cargar datos al inicio — combina API + localStorage
  useEffect(() => {
    const init = async () => {
      setLoading(true); setApiError(null);
      const local = loadFromStorage();
      try {
        const ctrl = new AbortController();
        const tid  = setTimeout(() => ctrl.abort(), 10000);
        const res  = await fetch(API_URL, { signal: ctrl.signal });
        clearTimeout(tid);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Respuesta inesperada.');

        const apiTasks = data.map(item => ({
          id: `api_${item.id}`,
          title: item.title,
          description: '',
          completed: item.completed,
          priority: item.completed ? 'low' : 'medium',
          category: 'API',
          dueDate: '',
          createdAt: new Date().toISOString(),
          isLocal: false,
        }));

        const localIds = new Set(local.map(t => t.id));
        setTasks([...local, ...apiTasks.filter(t => !localIds.has(t.id))]);
      } catch (err) {
        setApiError(err.name === 'AbortError'
          ? 'Tiempo de espera agotado.'
          : `No se pudo conectar: ${err.message}`);
        setTasks(local);
        showToast('Oráculo no disponible. Datos locales cargados.', 'warning');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [showToast]);

  // Persistir tareas locales
  useEffect(() => {
    saveToStorage(tasks.filter(t => t.isLocal));
  }, [tasks]);

  // CRUD
  const handleCreate = useCallback((formData) => {
    setTasks(prev => [{
      id: generateId(), ...formData,
      completed: false, createdAt: new Date().toISOString(), isLocal: true,
    }, ...prev]);
    showToast('¡Nueva misión registrada!', 'success');
  }, [showToast]);

  const handleUpdate = useCallback((formData, taskId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, ...formData, updatedAt: new Date().toISOString() } : t
    ));
    setEditingTask(null);
    showToast('Misión actualizada.', 'success');
  }, [showToast]);

  const handleDelete = useCallback((taskId) => {
    if (!window.confirm('¿Eliminar esta misión del grimorio?')) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Misión eliminada.', 'info');
  }, [showToast]);

  const handleToggle = useCallback((taskId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  }, []);

  const handleFormSubmit = useCallback((formData, taskId) => {
    taskId ? handleUpdate(formData, taskId) : handleCreate(formData);
  }, [handleCreate, handleUpdate]);

  const handleClearLocal = () => {
    if (!window.confirm('¿Eliminar todas las misiones creadas localmente?')) return;
    setTasks(prev => prev.filter(t => !t.isLocal));
    localStorage.removeItem(LOCAL_KEY);
    showToast('Misiones locales eliminadas.', 'info');
  };

  const pendingCount = tasks.filter(t => !t.completed).length;

  const tabs = [
    { key: 'tasks', icon: 'bi-shield-shaded',    label: 'Tablón de Misiones', count: tasks.length },
    { key: 'posts', icon: 'bi-journal-richtext',  label: 'Leyendas' },
    { key: 'about', icon: 'bi-info-circle',        label: 'Acerca del Proyecto' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar totalTasks={tasks.length} pendingTasks={pendingCount} />

      <main className="container-fluid px-3 px-md-4 py-4" style={{ maxWidth: 1100 }}>

        {/* Error de API */}
        {apiError && (
          <div className="alert alert-custom alert-gold d-flex align-items-center gap-3 mb-4">
            <i className="bi bi-wifi-off fs-5" />
            <div>
              <strong>Oráculo no disponible</strong><br />
              <small>{apiError} — Las misiones locales se muestran correctamente.</small>
            </div>
          </div>
        )}

        <StatsBar tasks={tasks} />

        {/* Tabs */}
        <ul className="nav nav-tabs-custom mb-4">
          {tabs.map(tab => (
            <li key={tab.key} className="nav-item">
              <button
                className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <i className={`bi ${tab.icon} me-2`} />
                {tab.label}
                {tab.count !== undefined && (
                  <span style={{
                    background: 'rgba(245,197,24,0.15)',
                    color: '#F5C518',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '1px 7px',
                    borderRadius: 20,
                    marginLeft: 7,
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* ===== TABLÓN DE MISIONES ===== */}
        {activeTab === 'tasks' && (
          <>
            <TaskForm
              onSubmit={handleFormSubmit}
              editingTask={editingTask}
              onCancelEdit={() => setEditingTask(null)}
            />
            {tasks.filter(t => t.isLocal).length > 0 && (
              <div className="d-flex justify-content-end mb-3">
                <button
                  className="btn btn-danger-ghost btn-sm d-flex align-items-center gap-2"
                  onClick={handleClearLocal}
                  style={{ border:'1px solid rgba(239,83,80,0.3)', color:'#ef5350', borderRadius:6, padding:'5px 13px' }}
                >
                  <i className="bi bi-trash3" />Limpiar misiones locales
                </button>
              </div>
            )}
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              loading={loading}
            />
          </>
        )}

        {/* ===== LEYENDAS ===== */}
        {activeTab === 'posts' && <PostsView showToast={showToast} />}

        {/* ===== ACERCA DEL PROYECTO ===== */}
        {activeTab === 'about' && (
          <div className="row g-4">
            <div className="col-12">
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderTop: '3px solid #F5C518',
                borderRadius: 8,
                padding: '2rem',
              }}>
                <h4 style={{ color:'var(--text-primary)', fontWeight:800, fontFamily:'Cinzel, serif', letterSpacing:'2px', marginBottom:'0.4rem' }}>
                  <i className="bi bi-shield-shaded me-2" style={{ color:'#F5C518' }} />
                  TaskMaster JRPG
                </h4>
                <p style={{ color:'var(--text-muted)', fontSize:'0.83rem', marginBottom:'2rem' }}>
                  SPA desarrollada para la Evaluación Sumativa 3 — Ingeniería en Informática
                </p>

                <div className="row g-3">
                  {[
                    { icon:'bi-puzzle-fill',       title:'Componentes React',  color:'#4fc3f7', desc:'useState, useEffect, useCallback, useMemo, props y componentes funcionales.' },
                    { icon:'bi-shield-fill-check',  title:'Desarrollo Seguro',  color:'#66bb6a', desc:'Validación de inputs, sanitización XSS, manejo de errores y feedback visual.' },
                    { icon:'bi-database-fill',      title:'CRUD + localStorage',color:'#F5C518', desc:'Crear, leer, actualizar y eliminar tareas con persistencia en localStorage.' },
                    { icon:'bi-cloud-fill',         title:'Consumo de API',     color:'#ce93d8', desc:'Fetch con try/catch, AbortController, estados de loading y manejo de errores HTTP.' },
                    { icon:'bi-robot',              title:'Asistencia IA',      color:'#ff7043', desc:'Claude AI para generar estructura, validaciones y mejoras de UX.' },
                    { icon:'bi-phone-fill',         title:'Diseño Responsive',  color:'#ffa726', desc:'Bootstrap 5 + CSS custom. Mobile first con paleta oscura temática JRPG.' },
                  ].map(card => (
                    <div key={card.title} className="col-12 col-md-6 col-lg-4">
                      <div style={{
                        background:'var(--bg-secondary)', border:'1px solid var(--border)',
                        borderRadius:8, padding:'1rem',
                      }}>
                        <i className={`bi ${card.icon} mb-2`} style={{ color:card.color, fontSize:'1.4rem', display:'block' }} />
                        <h6 style={{ fontWeight:700, color:'var(--text-primary)', marginBottom:3 }}>{card.title}</h6>
                        <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:0 }}>{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3" style={{ borderTop:'1px solid var(--border)' }}>
                  <p className="section-title">Stack tecnológico</p>
                  <div className="d-flex flex-wrap gap-2">
                    {['React 18','Bootstrap 5','CSS Variables','JSONPlaceholder API','localStorage','Fetch API','React Hooks','Cinzel Font'].map(tag => (
                      <span key={tag} style={{
                        background:'rgba(245,197,24,0.08)',
                        color:'#F5C518',
                        border:'1px solid rgba(245,197,24,0.2)',
                        borderRadius:20, padding:'3px 11px',
                        fontSize:'0.76rem', fontWeight:600,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast container */}
      <div className="toast-container-fixed">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </div>
  );
};

export default App;
