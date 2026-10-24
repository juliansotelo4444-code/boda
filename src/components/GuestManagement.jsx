import React, { useState, useRef } from 'react';
import { Users, Plus, Search, Filter, Move, Trash2, Edit2, CheckCircle, Clock, XCircle, Utensils } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const GuestManagement = () => {
  const { data, addGuest, updateGuest, deleteGuest, assignGuestToTable, updateTablePosition, updateTable, deleteTable, addTable } = useWedding();
  const [activeSubTab, setActiveSubTab] = useState('floor'); // 'floor' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tableCapacityError, setTableCapacityError] = useState(null);

  const handleTableCapacityChange = (tableId, newCapacity) => {
    if (newCapacity < 1) return;
    const res = updateTable(tableId, { capacity: Number(newCapacity) });
    if (!res.success) {
      setTableCapacityError(res.error);
    } else {
      setTableCapacityError(null);
    }
  };

  // Formulario nuevo invitado
  const [newGuestForm, setNewGuestForm] = useState({
    name: '',
    phone: '',
    companions: 0,
    status: 'Pendiente',
    menu: 'Tradicional',
    notes: '',
    tableId: ''
  });

  // Arrastre de mesas en Canvas
  const [draggingTable, setDraggingTable] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const handleMouseDownTable = (e, table) => {
    e.stopPropagation();
    setSelectedTableId(table.id);
    const canvasRect = canvasRef.current.getBoundingClientRect();
    setDraggingTable(table.id);
    setDragOffset({
      x: e.clientX - canvasRect.left - table.x,
      y: e.clientY - canvasRect.top - table.y
    });
  };

  const handleMouseMoveCanvas = (e) => {
    if (!draggingTable) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(canvasRect.width - 120, e.clientX - canvasRect.left - dragOffset.x));
    const newY = Math.max(20, Math.min(canvasRect.height - 120, e.clientY - canvasRect.top - dragOffset.y));
    updateTablePosition(draggingTable, Math.round(newX), Math.round(newY));
  };

  const handleMouseUpCanvas = () => {
    setDraggingTable(null);
  };

  // Filtrado de invitados para la lista
  const filteredGuests = data.guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || (g.notes && g.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'todos' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedTable = data.tables.find(t => t.id === selectedTableId);
  const seatedGuests = selectedTable ? data.guests.filter(g => g.tableId === selectedTable.id) : [];

  const handleCreateGuest = (e) => {
    e.preventDefault();
    if (!newGuestForm.name.trim()) return;
    addGuest(newGuestForm);
    setNewGuestForm({
      name: '',
      phone: '',
      companions: 0,
      status: 'Pendiente',
      menu: 'Tradicional',
      notes: '',
      tableId: ''
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="guests-module-container animate-fade-in">
      {/* HEADER Y SELECTOR DE VISTA */}
      <div className="module-top-bar">
        <div>
          <span className="module-kicker">ORGANIZACIÓN DE ESPACIOS &amp; RSVP</span>
          <h2 className="module-title font-serif">Gestión de Invitados y Mesas</h2>
        </div>

        <div className="subtabs-pill">
          <button 
            className={`subtab-btn ${activeSubTab === 'floor' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('floor')}
          >
            <Move size={16} /> Mapa Dinámico del Salón (Drag &amp; Drop)
          </button>
          <button 
            className={`subtab-btn ${activeSubTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('list')}
          >
            <Users size={16} /> Lista y Menú RSVP
          </button>
        </div>

        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} /> Agregar Invitado
        </button>
      </div>

      {/* SUBPESTAÑA 1: MAPA DINÁMICO DEL SALÓN (DRAG AND DROP) */}
      {activeSubTab === 'floor' && (
        <div className="floorplan-layout">
          <div className="floorplan-main">
            <div className="floorplan-toolbar">
              <span className="floorplan-hint">
                💡 <strong>Instrucciones:</strong> Haz clic y arrastra cualquier mesa para reorganizar el salón. Haz clic en una mesa para gestionar sus comensales.
              </span>
              <button 
                className="btn-secondary btn-sm"
                onClick={() => {
                  const num = data.tables.length;
                  addTable({
                    name: `Mesa ${num}`,
                    capacity: 8,
                    shape: 'round',
                    x: 100 + (num * 30) % 400,
                    y: 100 + (num * 40) % 300
                  });
                }}
              >
                <Plus size={14} /> Añadir Mesa
              </button>
            </div>

            {/* CANVAS INTERACTIVO */}
            <div 
              className="floor-canvas" 
              ref={canvasRef}
              onMouseMove={handleMouseMoveCanvas}
              onMouseUp={handleMouseUpCanvas}
              onMouseLeave={handleMouseUpCanvas}
            >
              {/* PISTA DE BAILE CENTRAL */}
              <div className="dance-floor-marker">
                <span className="dance-title">✨ PISTA DE BAILE &amp; DJ ✨</span>
                <span className="dance-sub">Julián &amp; Yanet</span>
              </div>

              {/* MESAS RENDERIZADAS */}
              {data.tables.map(table => {
                const isSelected = selectedTableId === table.id;
                const occupants = data.guests.filter(g => g.tableId === table.id);
                const totalPeople = occupants.reduce((acc, g) => acc + 1 + (g.companions || 0), 0);
                const isFull = totalPeople >= table.capacity;

                return (
                  <div
                    key={table.id}
                    className={`table-visual-node ${table.shape} ${isSelected ? 'selected' : ''} ${isFull ? 'full' : ''}`}
                    style={{
                      transform: `translate(${table.x}px, ${table.y}px)`,
                      borderColor: table.color || 'var(--burgundy-700)'
                    }}
                    onMouseDown={(e) => handleMouseDownTable(e, table)}
                  >
                    <div className="table-center-content">
                      <span className="table-visual-name">{table.name}</span>
                      <span className="table-visual-capacity">
                        {totalPeople} / {table.capacity} pax
                      </span>
                    </div>

                    {/* Sillas virtuales alrededor */}
                    <div className="chairs-indicator">
                      {Array.from({ length: Math.min(table.capacity, 10) }).map((_, idx) => (
                        <span 
                          key={idx} 
                          className={`chair-dot ${idx < totalPeople ? 'occupied' : 'empty'}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL LATERAL DE MESA SELECCIONADA */}
          <div className="floorplan-sidebar card-luxury">
            {selectedTable ? (
              <div className="table-details-panel">
                {/* CONFIGURACIÓN EDITABLE DE LA MESA */}
                <div className="panel-title-wrap" style={{ borderBottom: '1px solid #EDE7DF', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span className="badge-burgundy badge">{selectedTable.shape.toUpperCase()}</span>
                    <button
                      className="btn-icon-subtle"
                      title="Eliminar mesa del salón"
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de eliminar la mesa "${selectedTable.name}"? Los invitados asignados volverán a estar sin mesa.`)) {
                          deleteTable(selectedTable.id);
                          setSelectedTableId(null);
                        }
                      }}
                      style={{ color: '#DC2626', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                    >
                      🗑️ Eliminar Mesa
                    </button>
                  </div>

                  {/* Nombre editable de la mesa */}
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      NOMBRE DE LA MESA:
                    </label>
                    <input
                      type="text"
                      className="input-luxury"
                      value={selectedTable.name}
                      onChange={(e) => updateTable(selectedTable.id, { name: e.target.value })}
                      style={{ fontSize: '1rem', fontWeight: 700, padding: '0.4rem 0.6rem', color: 'var(--burgundy-900)' }}
                    />
                  </div>

                  {/* Selector de Forma */}
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      FORMA DE LA MESA:
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {[
                        { id: 'round', label: '⭕ Redonda' },
                        { id: 'rectangular', label: '▭ Rectangular' },
                        { id: 'presidential', label: '👑 Nupcial' }
                      ].map(shape => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => updateTable(selectedTable.id, { shape: shape.id })}
                          style={{
                            flex: 1,
                            padding: '0.35rem',
                            fontSize: '0.75rem',
                            fontWeight: selectedTable.shape === shape.id ? 700 : 500,
                            borderRadius: '6px',
                            border: selectedTable.shape === shape.id ? '2px solid var(--burgundy-700)' : '1px solid #DDD',
                            background: selectedTable.shape === shape.id ? 'var(--burgundy-50)' : '#FFF',
                            color: selectedTable.shape === shape.id ? 'var(--burgundy-800)' : 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CONTROL DE CAPACIDAD MÁXIMA (+ / -) */}
                  <div style={{ background: '#FAF7F5', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-gold-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--burgundy-900)' }}>
                          CAPACIDAD MÁXIMA
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Comensales: <strong>{seatedGuests.reduce((acc, g) => acc + 1 + (Number(g.companions) || 0), 0)} ocupados</strong>
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleTableCapacityChange(selectedTable.id, (selectedTable.capacity || 10) - 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            border: '1px solid #CCC',
                            background: '#FFF',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          -
                        </button>

                        <input
                          type="number"
                          value={selectedTable.capacity || 10}
                          onChange={(e) => handleTableCapacityChange(selectedTable.id, Number(e.target.value))}
                          min="1"
                          max="30"
                          style={{
                            width: '45px',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '1rem',
                            border: '1px solid var(--border-gold)',
                            borderRadius: '6px',
                            padding: '0.25rem'
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => handleTableCapacityChange(selectedTable.id, (selectedTable.capacity || 10) + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            border: '1px solid #CCC',
                            background: '#FFF',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* ALERTA DE VALIDACIÓN SI INTENTA REDUCIR POR DEBAJO DE LOS SENTADOS */}
                    {tableCapacityError && (
                      <div style={{ marginTop: '0.6rem', padding: '0.5rem', borderRadius: '6px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: '0.75rem', lineHeight: 1.3 }}>
                        ⚠️ {tableCapacityError}
                      </div>
                    )}
                  </div>
                </div>

                <div className="seated-guests-list">
                  <span className="section-label">Invitados sentados en esta mesa:</span>
                  {seatedGuests.length === 0 ? (
                    <p className="empty-msg">No hay invitados asignados aún a esta mesa.</p>
                  ) : (
                    seatedGuests.map(guest => (
                      <div key={guest.id} className="seated-guest-row">
                        <div className="guest-row-info">
                          <strong>{guest.name}</strong>
                          {guest.companions > 0 && <span className="comp-tag">+{guest.companions}</span>}
                          <div className="guest-menu-tag">🍴 {guest.menu}</div>
                        </div>
                        <button 
                          className="btn-icon-subtle" 
                          title="Quitar de esta mesa"
                          onClick={() => assignGuestToTable(guest.id, null)}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* SELECTOR PARA AGREGAR INVITADO A ESTA MESA */}
                <div className="assign-more-wrap">
                  <span className="section-label">Asignar otro invitado aquí:</span>
                  <select 
                    className="select-custom"
                    onChange={(e) => {
                      if (e.target.value) {
                        assignGuestToTable(e.target.value, selectedTable.id);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Seleccionar de invitados sin mesa...</option>
                    {data.guests
                      .filter(g => g.tableId !== selectedTable.id)
                      .map(g => (
                        <option key={g.id} value={g.id}>
                          {g.name} {g.tableId ? `(Mover de ${data.tables.find(t=>t.id===g.tableId)?.name || 'otra mesa'})` : '(Sin mesa)'}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="no-table-selected">
                <div className="select-table-icon">🪑</div>
                <h4>Ninguna mesa seleccionada</h4>
                <p>Haz clic en cualquiera de las mesas del plano para ver sus detalles y ubicar a tus invitados.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBPESTAÑA 2: LISTA GENERAL & PREFERENCIAS DE COMIDA */}
      {activeSubTab === 'list' && (
        <div className="guest-list-layout">
          {/* BARRA DE FILTROS */}
          <div className="filters-bar card-luxury">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o nota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-search"
              />
            </div>

            <div className="status-filter-pills">
              {['todos', 'Confirmado', 'Pendiente', 'Rechazado'].map(st => (
                <button
                  key={st}
                  className={`pill-filter ${statusFilter === st ? 'active' : ''}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st === 'todos' ? 'Todos los Invitados' : st}
                </button>
              ))}
            </div>
          </div>

          {/* TABLA DE INVITADOS */}
          <div className="card-luxury table-wrapper">
            <table className="guests-table">
              <thead>
                <tr>
                  <th>Invitado / Familia</th>
                  <th>Acompañantes</th>
                  <th>Estado RSVP</th>
                  <th>Preferencia de Menú</th>
                  <th>Mesa Asignada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                      <Users size={38} color="var(--gold-500)" style={{ margin: '0 auto 0.8rem auto', display: 'block' }} />
                      <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--bg-burgundy-900)' }}>
                        Aún no tienes invitados registrados
                      </strong>
                      <p style={{ fontSize: '0.85rem', margin: '0.4rem 0 1.2rem 0' }}>
                        Comienza a confeccionar la lista de la boda agregando a tus familiares y amigos o compartiendo el enlace RSVP.
                      </p>
                      <button type="button" className="btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={14} /> Agregar Primer Invitado
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map(guest => {
                    const assignedTable = data.tables.find(t => t.id === guest.tableId);
                    return (
                      <tr key={guest.id}>
                        <td>
                          <div className="guest-name-cell">
                            <strong>{guest.name}</strong>
                            {guest.notes && <span className="guest-note-hint">💬 {guest.notes}</span>}
                          </div>
                        </td>
                        <td>{guest.companions > 0 ? `+${guest.companions} personas` : 'Individual'}</td>
                        <td>
                          <span className={`status-badge-pill ${guest.status.toLowerCase()}`}>
                            {guest.status === 'Confirmado' && <CheckCircle size={13} />}
                            {guest.status === 'Pendiente' && <Clock size={13} />}
                            {guest.status === 'Rechazado' && <XCircle size={13} />}
                            {guest.status}
                          </span>
                        </td>
                        <td>
                          <span className="menu-choice-tag">
                            <Utensils size={13} /> {guest.menu}
                          </span>
                        </td>
                        <td>
                          <select 
                            className="table-mini-select"
                            value={guest.tableId || ''}
                            onChange={(e) => assignGuestToTable(guest.id, e.target.value || null)}
                          >
                            <option value="">Sin Asignar</option>
                            {data.tables.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon-subtle danger" 
                              title="Eliminar invitado"
                              onClick={() => deleteGuest(guest.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL CREAR INVITADO */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-dialog card-luxury" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-serif">Añadir Nuevo Invitado</h3>
              <button className="btn-close" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateGuest} className="modal-form">
              <div className="form-group">
                <label>Nombre y Apellido</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Tío Roberto"
                  value={newGuestForm.name}
                  onChange={e => setNewGuestForm({ ...newGuestForm, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono (WhatsApp)</label>
                  <input 
                    type="text" 
                    placeholder="+54 9 11 ..."
                    value={newGuestForm.phone}
                    onChange={e => setNewGuestForm({ ...newGuestForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Acompañantes adicionales</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="6"
                    value={newGuestForm.companions}
                    onChange={e => setNewGuestForm({ ...newGuestForm, companions: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estado RSVP</label>
                  <select 
                    value={newGuestForm.status}
                    onChange={e => setNewGuestForm({ ...newGuestForm, status: e.target.value })}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferencia de Menú</label>
                  <select 
                    value={newGuestForm.menu}
                    onChange={e => setNewGuestForm({ ...newGuestForm, menu: e.target.value })}
                  >
                    <option value="Tradicional">Tradicional</option>
                    <option value="Vegetariano">Vegetariano</option>
                    <option value="Vegano">Vegano</option>
                    <option value="Celíaco">Celíaco / Gluten-Free</option>
                    <option value="Menú Infantil">Menú Infantil</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notas Privadas</label>
                <input 
                  type="text" 
                  placeholder="Padrino, amigos facultad, etc."
                  value={newGuestForm.notes}
                  onChange={e => setNewGuestForm({ ...newGuestForm, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Invitado</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .guests-module-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }
        .module-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1.2rem;
        }
        .module-kicker {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: var(--burgundy-600);
          font-weight: 700;
          text-transform: uppercase;
          display: block;
        }
        .module-title {
          font-size: 2rem;
          color: var(--bg-burgundy-900);
          margin: 0;
        }
        .subtabs-pill {
          background: white;
          border: 1px solid var(--border-gold-subtle);
          padding: 4px;
          border-radius: var(--radius-pill);
          display: flex;
          gap: 4px;
        }
        .subtab-btn {
          padding: 0.5rem 1.2rem;
          border-radius: var(--radius-pill);
          font-size: 0.85rem;
          font-weight: 600;
          background: transparent;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .subtab-btn.active {
          background: var(--burgundy-700);
          color: var(--champagne-200);
          box-shadow: 0 2px 8px rgba(103, 0, 26, 0.25);
        }

        /* Floorplan Layout */
        .floorplan-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 1.8rem;
        }
        .floorplan-main {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .floorplan-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 0.8rem 1.2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-gold-subtle);
        }
        .floorplan-hint {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .btn-sm {
          padding: 0.45rem 0.9rem;
          font-size: 0.8rem;
        }
        .floor-canvas {
          background-color: #FAF4EB;
          background-image: 
            radial-gradient(rgba(197, 160, 89, 0.3) 1px, transparent 1px),
            linear-gradient(to right, rgba(197, 160, 89, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          height: 620px;
          border-radius: var(--radius-lg);
          border: 2px dashed var(--gold-500);
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
          user-select: none;
        }
        .dance-floor-marker {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 220px;
          height: 160px;
          background: rgba(255, 255, 255, 0.7);
          border: 2px solid var(--border-gold-bright);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 4px 15px rgba(197, 160, 89, 0.2);
          pointer-events: none;
        }
        .dance-title {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--burgundy-700);
        }
        .dance-sub {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--gold-600);
        }

        /* Mesas */
        .table-visual-node {
          position: absolute;
          top: 0;
          left: 0;
          cursor: grab;
          background: white;
          border: 3px solid var(--burgundy-700);
          box-shadow: var(--shadow-md);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .table-visual-node:active {
          cursor: grabbing;
        }
        .table-visual-node.round {
          width: 120px;
          height: 120px;
          border-radius: 50%;
        }
        .table-visual-node.rectangular {
          width: 150px;
          height: 90px;
          border-radius: 14px;
        }
        .table-visual-node.presidential {
          width: 170px;
          height: 70px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FFF9EE 0%, #FFFFFF 100%);
        }
        .table-visual-node.selected {
          box-shadow: 0 0 0 4px var(--gold-500), 0 8px 25px rgba(103, 0, 26, 0.3);
          border-color: var(--burgundy-700);
        }
        .table-center-content {
          text-align: center;
          pointer-events: none;
        }
        .table-visual-name {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--bg-burgundy-900);
        }
        .table-visual-capacity {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .chairs-indicator {
          position: absolute;
          inset: -12px;
          pointer-events: none;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .chair-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid var(--border-gold-subtle);
        }
        .chair-dot.occupied {
          background: var(--burgundy-700);
        }
        .chair-dot.empty {
          background: #E5DEC9;
        }

        /* Sidebar Mesas */
        .floorplan-sidebar {
          padding: 1.8rem;
          height: 670px;
          overflow-y: auto;
        }
        .no-table-selected {
          text-align: center;
          padding: 4rem 1rem;
          color: var(--text-muted);
        }
        .select-table-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .selected-table-name {
          font-size: 1.4rem;
          margin-top: 0.5rem;
          color: var(--burgundy-700);
        }
        .table-capacity-status {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.2rem;
        }
        .section-label {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--burgundy-600);
          display: block;
          margin-bottom: 0.6rem;
        }
        .seated-guest-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0.8rem;
          background: var(--surface-card-subtle);
          border: 1px solid var(--border-gold-subtle);
          border-radius: var(--radius-sm);
          margin-bottom: 0.5rem;
        }
        .guest-row-info strong {
          font-size: 0.88rem;
          color: var(--text-primary);
        }
        .comp-tag {
          font-size: 0.7rem;
          background: var(--champagne-200);
          color: var(--bg-burgundy-950);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          margin-left: 0.4rem;
          font-weight: 700;
        }
        .guest-menu-tag {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .btn-icon-subtle {
          background: none;
          color: var(--text-muted);
          padding: 0.3rem;
          border-radius: 4px;
        }
        .btn-icon-subtle:hover {
          color: var(--burgundy-700);
          background: var(--burgundy-100);
        }
        .btn-icon-subtle.danger:hover {
          color: #D32F2F;
          background: #FFEBEE;
        }
        .assign-more-wrap {
          margin-top: 1.8rem;
          padding-top: 1.2rem;
          border-top: 1px solid var(--border-gold-subtle);
        }
        .select-custom {
          width: 100%;
          padding: 0.65rem 0.8rem;
          border: 1px solid var(--border-gold-bright);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          background: white;
          color: var(--text-primary);
        }

        /* Lista General */
        .filters-bar {
          padding: 1.2rem 1.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .search-input-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--surface-cream);
          border: 1px solid var(--border-gold-subtle);
          border-radius: var(--radius-pill);
          padding: 0.45rem 1rem;
          width: 320px;
        }
        .search-icon {
          color: var(--gold-600);
        }
        .input-search {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 0.875rem;
        }
        .status-filter-pills {
          display: flex;
          gap: 0.5rem;
        }
        .pill-filter {
          background: var(--surface-cream);
          border: 1px solid var(--border-gold-subtle);
          padding: 0.4rem 0.9rem;
          border-radius: var(--radius-pill);
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .pill-filter.active {
          background: var(--burgundy-700);
          color: var(--champagne-200);
          border-color: var(--burgundy-700);
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .guests-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .guests-table th {
          padding: 1rem 1.2rem;
          background: var(--champagne-50);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--bg-burgundy-900);
          border-bottom: 1px solid var(--border-gold-subtle);
        }
        .guests-table td {
          padding: 1rem 1.2rem;
          border-bottom: 1px solid rgba(197, 160, 89, 0.15);
          font-size: 0.88rem;
        }
        .guest-name-cell strong {
          display: block;
          color: var(--bg-burgundy-900);
        }
        .guest-note-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .status-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-pill);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-badge-pill.confirmado {
          background: #E8F5E9;
          color: #2E7D32;
        }
        .status-badge-pill.pendiente {
          background: #FFF8E1;
          color: #F57F17;
        }
        .status-badge-pill.rechazado {
          background: #FFEBEE;
          color: #C62828;
        }
        .menu-choice-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .table-mini-select {
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-gold-subtle);
          font-size: 0.82rem;
          background: white;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(46, 5, 16, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }
        .modal-dialog {
          width: 100%;
          max-width: 520px;
          padding: 2rem;
          background: white;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .modal-header h3 {
          margin: 0;
          color: var(--burgundy-700);
          font-size: 1.5rem;
        }
        .btn-close {
          background: none;
          font-size: 1.2rem;
          color: var(--text-muted);
        }
        .form-group {
          margin-bottom: 1.2rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.35rem;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid var(--border-gold-subtle);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          outline: none;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.8rem;
          margin-top: 1.8rem;
        }

        @media (max-width: 950px) {
          .floorplan-layout {
            grid-template-columns: 1fr;
          }
          .floor-canvas {
            height: 480px;
          }
        }
      `}</style>
    </div>
  );
};
