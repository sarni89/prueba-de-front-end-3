// components/TaskForm.jsx — Formulario CRUD con validaciones y temática JRPG

import React, { useState, useEffect } from 'react';

const sanitizeInput = (value) =>
  value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();

const PRIORITY_OPTIONS = [
  { value: 'low',    label: '⬇ Baja',   color: '#66bb6a' },
  { value: 'medium', label: '➡ Media',  color: '#ffa726' },
  { value: 'high',   label: '⬆ Alta',   color: '#ef5350' },
];

const TaskForm = ({ onSubmit, editingTask, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', category: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title:       editingTask.title || '',
        description: editingTask.description || '',
        priority:    editingTask.priority || 'medium',
        dueDate:     editingTask.dueDate || '',
        category:    editingTask.category || '',
      });
      setErrors({});
    }
  }, [editingTask]);

  const validate = () => {
    const e = {};
    if (!formData.title.trim())            e.title = 'El título de la misión es obligatorio.';
    else if (formData.title.trim().length < 3) e.title = 'El título debe tener al menos 3 caracteres.';
    else if (formData.title.length > 100)  e.title = 'Máximo 100 caracteres.';
    if (formData.description.length > 300) e.description = 'Máximo 300 caracteres.';
    if (formData.dueDate) {
      const today = new Date(); today.setHours(0,0,0,0);
      if (new Date(formData.dueDate + 'T00:00:00') < today)
        e.dueDate = 'La fecha no puede ser anterior a hoy.';
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }
    setIsSubmitting(true);
    try {
      await onSubmit({
        title:       sanitizeInput(formData.title),
        description: sanitizeInput(formData.description),
        priority:    formData.priority,
        dueDate:     formData.dueDate,
        category:    sanitizeInput(formData.category),
      }, editingTask?.id);
      if (!editingTask) setFormData({ title:'', description:'', priority:'medium', dueDate:'', category:'' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title:'', description:'', priority:'medium', dueDate:'', category:'' });
    setErrors({});
    onCancelEdit();
  };

  const isEditing = Boolean(editingTask);
  const accentColor = isEditing ? '#4fc3f7' : '#F5C518';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderTop: `3px solid ${accentColor}`,
      borderRadius: 8,
      padding: '1.5rem',
      marginBottom: '1.5rem',
    }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <i
          className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle-fill'}`}
          style={{ color: accentColor, fontSize: '1.1rem' }}
        />
        <h6 className="mb-0" style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>
          {isEditing ? 'Editar Misión' : 'Nueva Misión'}
        </h6>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          {/* Título */}
          <div className="col-12 col-md-6">
            <label className="form-label-custom">Título <span style={{ color: '#F5C518' }}>*</span></label>
            <input
              type="text" name="title"
              className={`form-control form-control-dark ${errors.title ? 'border-danger' : ''}`}
              placeholder="Nombre de la misión..."
              value={formData.title} onChange={handleChange} maxLength={100} autoComplete="off"
            />
            {errors.title && (
              <div className="mt-1" style={{ color: '#ef5350', fontSize: '0.77rem' }}>
                <i className="bi bi-exclamation-circle me-1" />{errors.title}
              </div>
            )}
          </div>

          {/* Categoría */}
          <div className="col-12 col-md-3">
            <label className="form-label-custom">Categoría</label>
            <input
              type="text" name="category"
              className="form-control form-control-dark"
              placeholder="Ej: Trabajo, Estudio..."
              value={formData.category} onChange={handleChange} maxLength={50} autoComplete="off"
            />
          </div>

          {/* Prioridad */}
          <div className="col-6 col-md-2">
            <label className="form-label-custom">Rango</label>
            <select name="priority" className="form-control form-control-dark" value={formData.priority} onChange={handleChange}>
              {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Fecha */}
          <div className="col-6 col-md-1" style={{ minWidth: 140 }}>
            <label className="form-label-custom">Límite</label>
            <input
              type="date" name="dueDate"
              className={`form-control form-control-dark ${errors.dueDate ? 'border-danger' : ''}`}
              value={formData.dueDate} onChange={handleChange}
            />
            {errors.dueDate && (
              <div className="mt-1" style={{ color: '#ef5350', fontSize: '0.77rem' }}>{errors.dueDate}</div>
            )}
          </div>

          {/* Descripción */}
          <div className="col-12">
            <label className="form-label-custom">
              Descripción{' '}
              <small style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>
                ({formData.description.length}/300)
              </small>
            </label>
            <textarea
              name="description"
              className={`form-control form-control-dark ${errors.description ? 'border-danger' : ''}`}
              placeholder="Detalles de la misión..."
              value={formData.description} onChange={handleChange} rows={2} maxLength={300}
            />
            {errors.description && (
              <div className="mt-1" style={{ color: '#ef5350', fontSize: '0.77rem' }}>{errors.description}</div>
            )}
          </div>

          {/* Botones */}
          <div className="col-12 d-flex gap-2 justify-content-end">
            {isEditing && (
              <button type="button" className="btn btn-ghost px-4" onClick={handleCancel}>
                <i className="bi bi-x-lg me-2" />Cancelar
              </button>
            )}
            <button
              type="submit"
              className={`btn ${isEditing ? 'btn-crystal' : 'btn-gold'} px-4`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" />Guardando...</>
              ) : (
                <><i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-plus-lg'} me-2`} />
                  {isEditing ? 'Actualizar' : 'Agregar Misión'}</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
