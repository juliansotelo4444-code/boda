import React, { useState } from 'react';
import { CheckSquare, Plus, Bell, Calendar, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const TodoList = () => {
  const { data, toggleTask, addTask, sendTestNotification, notificationPermission, requestNotificationPermission } = useWedding();
  const [filterAssigned, setFilterAssigned] = useState('todos');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    dueDate: '2026-11-20',
    assignedTo: 'Ambos',
    priority: 'Alta',
    category: 'General'
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;
    addTask(newTaskForm);
    setNewTaskForm({
      title: '',
      dueDate: '2026-11-20',
      assignedTo: 'Ambos',
      priority: 'Alta',
      category: 'General'
    });
    setShowAddForm(false);
  };

  const filteredTasks = data.tasks.filter(t => {
    if (filterAssigned === 'todos') return true;
    return t.assignedTo === filterAssigned || t.assignedTo === 'Ambos';
  });

  const completedCount = data.tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / data.tasks.length) * 100) || 0;

  return (
    <div className="todo-module-container animate-fade-in">
      <div className="module-top-bar">
        <div>
          <span className="module-kicker">HITOS Y CRONOGRAMA COMPARTIDO</span>
          <h2 className="module-title font-serif">Cronograma y Tareas (To-Do List)</h2>
          <p className="module-desc">
            Seguimiento sincronizado entre Julián y Yanet con alertas automáticas push para no olvidar fechas de pagos o reuniones con proveedores.
          </p>
        </div>

        <div className="todo-actions-top">
          <button 
            className="btn-outline"
            onClick={async () => {
              if (notificationPermission !== 'granted') {
                await requestNotificationPermission();
              } else {
                sendTestNotification(
                  'Recordatorio de Pago de Boda 💰',
                  'Seña de Catering & Bebidas vence en 48 horas. Verificado en tu panel.'
                );
              }
            }}
          >
            <Bell size={16} /> Probar Alerta Push
          </button>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={16} /> Nueva Tarea
          </button>
        </div>
      </div>

      {/* BARRA DE PROGRESO GLOBAL */}
      <div className="progress-banner-card card-luxury">
        <div className="progress-info-row">
          <div>
            <strong>Progreso Global de Preparativos:</strong> {completedCount} de {data.tasks.length} tareas completadas
          </div>
          <span className="percent-badge">{progressPercent}%</span>
        </div>
        <div className="progress-track-todo">
          <div className="progress-fill-todo" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* FORMULARIO AGREGAR TAREA RÁPIDA */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="task-add-card card-luxury animate-fade-in">
          <h3 className="font-serif">Planificar Nueva Tarea</h3>
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Descripción de la Tarea / Hito</label>
              <input 
                type="text" 
                placeholder="Ej. Comprar souvenir y kit de medianoche"
                required
                value={newTaskForm.title}
                onChange={e => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Fecha Límite</label>
              <input 
                type="date" 
                value={newTaskForm.dueDate}
                onChange={e => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Asignado a:</label>
              <select 
                value={newTaskForm.assignedTo}
                onChange={e => setNewTaskForm({ ...newTaskForm, assignedTo: e.target.value })}
              >
                <option value="Ambos">Ambos Novios</option>
                <option value="Julián">Julián</option>
                <option value="Yanet">Yanet</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prioridad:</label>
              <select 
                value={newTaskForm.priority}
                onChange={e => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
              >
                <option value="Urgente">Urgente</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div className="form-group">
              <label>Categoría:</label>
              <input 
                type="text" 
                placeholder="Catering, Música, etc."
                value={newTaskForm.category}
                onChange={e => setNewTaskForm({ ...newTaskForm, category: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => setShowAddForm(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar en Cronograma</button>
          </div>
        </form>
      )}

      {/* FILTROS POR RESPONSABLE */}
      <div className="tasks-filter-bar">
        <span className="filter-title">Filtrar por responsable:</span>
        <div className="filter-pills">
          {['todos', 'Julián', 'Yanet', 'Ambos'].map(resp => (
            <button
              key={resp}
              className={`filter-btn ${filterAssigned === resp ? 'active' : ''}`}
              onClick={() => setFilterAssigned(resp)}
            >
              {resp === 'todos' ? 'Todas las Tareas' : `Tareas de ${resp}`}
            </button>
          ))}
        </div>
      </div>

      {/* TIMELINE INTERACTIVO */}
      <div className="timeline-tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="card-luxury" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
            <CheckSquare size={40} color="var(--gold-500)" style={{ margin: '0 auto 0.8rem auto', display: 'block' }} />
            <h4 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--burgundy-700)', marginBottom: '0.4rem' }}>
              Cronograma sin tareas registradas
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
              Comienza a planificar los preparativos de la boda de Julián y Yanet haciendo clic en "Nueva Tarea".
            </p>
            <button className="btn-primary btn-sm" onClick={() => setShowAddForm(true)}>
              <Plus size={14} /> Crear Primera Tarea
            </button>
          </div>
        ) : (
          filteredTasks.map(task => (
          <div key={task.id} className={`task-timeline-card card-luxury ${task.completed ? 'is-done' : ''}`}>
            <button 
              className={`checkbox-circle ${task.completed ? 'checked' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              {task.completed && <CheckCircle size={18} color="#fff" />}
            </button>

            <div className="task-content-main">
              <div className="task-title-row">
                <h4 className="task-heading">{task.title}</h4>
                <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>

              <div className="task-meta-details">
                <span className="meta-item">
                  <Calendar size={14} /> Fecha Límite: <strong>{task.dueDate}</strong>
                </span>
                <span className="meta-item">
                  <User size={14} /> Responsable: <strong>{task.assignedTo}</strong>
                </span>
                <span className="meta-item category-badge">
                  🏷️ {task.category}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
      </div>

      <style>{`
        .todo-module-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }
        .module-desc {
          color: var(--text-secondary);
          margin-top: 0.3rem;
          font-size: 0.95rem;
        }
        .todo-actions-top {
          display: flex;
          gap: 0.8rem;
          align-items: center;
        }
        .progress-banner-card {
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #FFFFFF 0%, #FAF4EA 100%);
        }
        .progress-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
        }
        .percent-badge {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--burgundy-700);
        }
        .progress-track-todo {
          height: 10px;
          background: #E8E1D5;
          border-radius: var(--radius-pill);
          overflow: hidden;
        }
        .progress-fill-todo {
          height: 100%;
          background: linear-gradient(90deg, var(--gold-500) 0%, var(--burgundy-700) 100%);
          transition: width 0.4s ease;
        }
        .task-add-card {
          padding: 1.8rem;
          margin-bottom: 2rem;
        }
        .flex-2 { flex: 2; }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.8rem;
          margin-top: 1.2rem;
        }
        .tasks-filter-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .filter-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--burgundy-700);
          text-transform: uppercase;
        }
        .filter-pills {
          display: flex;
          gap: 0.5rem;
        }
        .filter-btn {
          background: white;
          border: 1px solid var(--border-gold-subtle);
          padding: 0.4rem 1rem;
          border-radius: var(--radius-pill);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .filter-btn.active {
          background: var(--burgundy-700);
          color: var(--champagne-200);
          border-color: var(--burgundy-700);
        }
        .timeline-tasks-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .task-timeline-card {
          padding: 1.4rem 1.6rem;
          display: flex;
          align-items: flex-start;
          gap: 1.2rem;
          transition: all 0.2s ease;
        }
        .task-timeline-card.is-done {
          background: #FAF9F7;
          opacity: 0.75;
        }
        .task-timeline-card.is-done .task-heading {
          text-decoration: line-through;
          color: var(--text-muted);
        }
        .checkbox-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid var(--burgundy-500);
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 3px;
          flex-shrink: 0;
        }
        .checkbox-circle.checked {
          background: var(--burgundy-700);
          border-color: var(--burgundy-700);
        }
        .task-content-main {
          flex: 1;
        }
        .task-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .task-heading {
          font-size: 1.1rem;
          margin: 0;
          color: var(--bg-burgundy-900);
        }
        .priority-tag {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }
        .priority-tag.urgente { background: #FFEBEE; color: #C62828; }
        .priority-tag.alta { background: #FFF3E0; color: #EF6C00; }
        .priority-tag.media { background: #E8F5E9; color: #2E7D32; }
        .task-meta-details {
          display: flex;
          gap: 1.2rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .category-badge {
          background: var(--champagne-100);
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          color: #8C6527;
        }
      `}</style>
    </div>
  );
};
