import React, { useState } from 'react';
import { Compass, Plane, Car, Home, Sun, MapPin, Plus, ExternalLink, Calendar, Check, Edit2, Save, X, Trash2 } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const HoneymoonPlanner = () => {
  const { data, addHoneymoonItem, updateHoneymoonItem, deleteHoneymoonItem, updateHoneymoon } = useWedding();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDestinationModal, setShowEditDestinationModal] = useState(false);
  const [editingHoneymoonItem, setEditingHoneymoonItem] = useState(null);

  const [destForm, setDestForm] = useState({
    destination: data.honeymoon?.destination || 'Neuquén, Patagonia Argentina',
    dates: data.honeymoon?.dates || 'Octubre 2027',
    budget: data.honeymoon?.budget || 5000,
    description: data.honeymoon?.description || 'Ruta de los Siete Lagos, bodegas patagónicas y paisajes andinos de ensueño.',
  });

  const [newItem, setNewItem] = useState({
    type: 'Hotel',
    title: '',
    ref: '',
    dates: '',
    cost: 500,
    status: 'Planificado'
  });

  const totalCost = (data.honeymoon?.items || []).reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);

  const handleSaveDestination = (e) => {
    e.preventDefault();
    updateHoneymoon(destForm);
    setShowEditDestinationModal(false);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;
    addHoneymoonItem(newItem);
    setNewItem({ type: 'Hotel', title: '', ref: '', dates: '', cost: 500, status: 'Planificado' });
    setShowAddModal(false);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Vuelo': return Plane;
      case 'Alquiler Auto': return Car;
      case 'Hotel': return Home;
      default: return Sun;
    }
  };

  return (
    <div className="honeymoon-container animate-fade-in">
      <div className="module-top-bar">
        <div>
          <span className="module-kicker">VIAJE NUPCIAL DE LOS NOVIOS</span>
          <h2 className="module-title font-serif">Luna de Miel: {data.honeymoon?.destination || 'Neuquén'}</h2>
          <p className="honeymoon-dates">
            📅 {data.honeymoon?.dates || 'Octubre 2027'} • Presupuesto asignado: ${(data.honeymoon?.budget || 5000).toLocaleString()} USD
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn-secondary"
            onClick={() => {
              setDestForm({
                destination: data.honeymoon?.destination || 'Neuquén, Patagonia Argentina',
                dates: data.honeymoon?.dates || 'Octubre 2027',
                budget: data.honeymoon?.budget || 5000,
                description: data.honeymoon?.description || 'Ruta de los Siete Lagos, bodegas patagónicas y paisajes andinos de ensueño.',
              });
              setShowEditDestinationModal(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem' }}
          >
            <Edit2 size={16} /> Editar Destino
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Añadir Reserva / Actividad
          </button>
        </div>
      </div>

      {/* TARJETA DESTINO DESTACADO DINÁMICA */}
      <div className="destination-banner card-burgundy" style={{ position: 'relative' }}>
        <div className="destination-content">
          <span className="tag-honeymoon">PRIMER VIAJE COMO ESPOSOS</span>
          <h3 className="dest-title font-serif">{data.honeymoon?.destination || 'Neuquén, Patagonia Argentina'}</h3>
          <p className="dest-sub font-display">
            {data.honeymoon?.description || 'Ruta de los Siete Lagos, bodegas patagónicas y paisajes andinos de ensueño.'}
          </p>
          <div className="cost-summary-pill">
            <span>Inversión Estimada: <strong>${totalCost.toLocaleString()} USD</strong></span>
          </div>
        </div>
      </div>

      {/* MODAL EDITAR DESTINO */}
      {showEditDestinationModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-luxury card-luxury" style={{ maxWidth: '520px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-serif" style={{ color: 'var(--burgundy-700)', fontSize: '1.3rem', margin: 0 }}>
                Editar Información de Luna de Miel
              </h3>
              <button
                onClick={() => setShowEditDestinationModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDestination}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Destino / Región:
                </label>
                <input
                  type="text"
                  className="input-luxury"
                  value={destForm.destination}
                  onChange={(e) => setDestForm({ ...destForm, destination: e.target.value })}
                  placeholder="Ej: Neuquén, Patagonia Argentina"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Fechas estimadas:
                  </label>
                  <input
                    type="text"
                    className="input-luxury"
                    value={destForm.dates}
                    onChange={(e) => setDestForm({ ...destForm, dates: e.target.value })}
                    placeholder="Ej: Octubre 2027"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Presupuesto (USD):
                  </label>
                  <input
                    type="number"
                    className="input-luxury"
                    value={destForm.budget}
                    onChange={(e) => setDestForm({ ...destForm, budget: Number(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Descripción / Narrativa del Viaje:
                </label>
                <textarea
                  className="input-luxury"
                  rows={3}
                  value={destForm.description}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                  placeholder="Describe la ruta, paradas o actividades soñadas..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditDestinationModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={16} /> Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRILLA DE RESERVAS E ITINERARIO */}
      {data.honeymoon.items.length === 0 ? (
        <div className="card-luxury" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
          <Compass size={44} color="var(--gold-500)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
          <h4 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--burgundy-700)', marginBottom: '0.5rem' }}>
            Tu itinerario de Luna de Miel está listo
          </h4>
          <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Empieza a guardar aquí los pasajes de avión, reservas de hoteles, alquileres de auto o excursiones para tener todo a mano durante el viaje.
          </p>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Añadir Primera Reserva
          </button>
        </div>
      ) : (
        <div className="honeymoon-items-grid">
          {data.honeymoon.items.map(item => {
          const Icon = getIconForType(item.type);
          return (
            <div key={item.id} className="honeymoon-card card-luxury">
              <div className="card-top-type" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="type-icon-circle">
                    <Icon size={18} />
                  </div>
                  <span className="type-name">{item.type}</span>
                  <span className="status-pill-small">{item.status}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button
                    type="button"
                    className="btn-icon-subtle"
                    title="Editar reserva"
                    onClick={() => setEditingHoneymoonItem(item)}
                    style={{ padding: '0.25rem' }}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon-subtle"
                    title="Eliminar reserva"
                    onClick={() => {
                      if (window.confirm(`¿Deseas eliminar la reserva "${item.title}"?`)) {
                        deleteHoneymoonItem(item.id);
                      }
                    }}
                    style={{ color: '#DC2626', padding: '0.25rem' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <h4 className="honeymoon-title">{item.title}</h4>

              <div className="honeymoon-meta">
                <div className="meta-line">
                  <Calendar size={13} /> <span>{item.dates}</span>
                </div>
                {item.ref && (
                  <div className="meta-line">
                    <strong>Ref/Voucher:</strong> <code>{item.ref}</code>
                  </div>
                )}
              </div>

              <div className="honeymoon-footer">
                <span className="item-cost font-serif">${Number(item.cost).toLocaleString()} USD</span>
                <span className="badge-gold badge">Reserva Lista</span>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* MODAL EDITAR RESERVA LUNA DE MIEL */}
      {editingHoneymoonItem && (
        <div className="modal-backdrop" onClick={() => setEditingHoneymoonItem(null)}>
          <div className="modal-dialog card-luxury" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-serif">Editar Reserva de Luna de Miel</h3>
              <button className="btn-close" onClick={() => setEditingHoneymoonItem(null)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateHoneymoonItem(editingHoneymoonItem.id, editingHoneymoonItem);
              setEditingHoneymoonItem(null);
            }} className="modal-form">
              <div className="form-group">
                <label>Tipo de Reserva</label>
                <select
                  className="select-custom"
                  value={editingHoneymoonItem.type}
                  onChange={e => setEditingHoneymoonItem({ ...editingHoneymoonItem, type: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  <option value="Hotel">Hotel / Alojamiento</option>
                  <option value="Vuelo">Vuelo / Traslado</option>
                  <option value="Alquiler Auto">Alquiler de Auto / 4x4</option>
                  <option value="Actividad">Excursión / Actividad</option>
                </select>
              </div>

              <div className="form-group">
                <label>Título / Descripción</label>
                <input
                  type="text"
                  required
                  value={editingHoneymoonItem.title}
                  onChange={e => setEditingHoneymoonItem({ ...editingHoneymoonItem, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Fechas</label>
                <input
                  type="text"
                  value={editingHoneymoonItem.dates || ''}
                  onChange={e => setEditingHoneymoonItem({ ...editingHoneymoonItem, dates: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Costo Estimado (USD)</label>
                <input
                  type="number"
                  min="0"
                  value={editingHoneymoonItem.cost}
                  onChange={e => setEditingHoneymoonItem({ ...editingHoneymoonItem, cost: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Referencia / Voucher / Código</label>
                <input
                  type="text"
                  value={editingHoneymoonItem.ref || ''}
                  onChange={e => setEditingHoneymoonItem({ ...editingHoneymoonItem, ref: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setEditingHoneymoonItem(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVA RESERVA */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog card-luxury" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-serif">Añadir Reserva para Luna de Miel</h3>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddItem} className="modal-form">
              <div className="form-group">
                <label>Categoría</label>
                <select 
                  value={newItem.type}
                  onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                >
                  <option value="Vuelo">Vuelo / Pasaje</option>
                  <option value="Hotel">Hotel / Alojamiento</option>
                  <option value="Alquiler Auto">Alquiler de Auto</option>
                  <option value="Excursión">Excursión / Tour</option>
                  <option value="Cena Romántica">Cena Romántica</option>
                </select>
              </div>
              <div className="form-group">
                <label>Título / Descripción</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Noche en hotel boutique o alquiler de scooter"
                  value={newItem.title}
                  onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fechas / Días</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 15 al 18 de Octubre"
                    value={newItem.dates}
                    onChange={e => setNewItem({ ...newItem, dates: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Costo Estimado (USD)</label>
                  <input 
                    type="number" 
                    value={newItem.cost}
                    onChange={e => setNewItem({ ...newItem, cost: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Código de Reserva / Referencia</label>
                <input 
                  type="text" 
                  placeholder="Ej. BOOK-1234 o SIXT-99"
                  value={newItem.ref}
                  onChange={e => setNewItem({ ...newItem, ref: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar en Itinerario</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .honeymoon-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }
        .honeymoon-dates {
          color: var(--text-secondary);
          margin-top: 0.2rem;
          font-size: 0.95rem;
        }
        .destination-banner {
          padding: 2.8rem 2.5rem;
          margin-bottom: 2rem;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #4A0E17 0%, #2A040D 100%);
          border: 1px solid var(--border-gold-bright);
        }
        .tag-honeymoon {
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          color: var(--champagne-300);
          font-weight: 700;
          text-transform: uppercase;
        }
        .dest-title {
          font-size: 2.4rem;
          color: #FFF9EE;
          margin: 0.4rem 0;
        }
        .dest-sub {
          font-size: 1.35rem;
          color: var(--champagne-200);
          margin-bottom: 1.4rem;
        }
        .cost-summary-pill {
          display: inline-block;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--gold-500);
          padding: 0.4rem 1.2rem;
          border-radius: var(--radius-pill);
          color: var(--champagne-100);
          font-size: 0.88rem;
        }
        .honeymoon-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.8rem;
        }
        .honeymoon-card {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .card-top-type {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .type-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--burgundy-100);
          color: var(--burgundy-700);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .type-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--burgundy-700);
          text-transform: uppercase;
          flex: 1;
        }
        .status-pill-small {
          font-size: 0.72rem;
          background: #E8F5E9;
          color: #2E7D32;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-pill);
          font-weight: 700;
        }
        .honeymoon-title {
          font-size: 1.15rem;
          color: var(--bg-burgundy-900);
          margin: 0;
        }
        .honeymoon-meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .meta-line {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .meta-line code {
          background: var(--surface-cream);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
          color: var(--burgundy-700);
        }
        .honeymoon-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-gold-subtle);
          padding-top: 0.8rem;
          margin-top: auto;
        }
        .item-cost {
          font-size: 1.3rem;
          color: var(--burgundy-700);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
