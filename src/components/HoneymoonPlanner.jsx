import React, { useState } from 'react';
import { Compass, Plane, Car, Home, Sun, MapPin, Plus, ExternalLink, Calendar, Check } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const HoneymoonPlanner = () => {
  const { data, addHoneymoonItem } = useWedding();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    type: 'Hotel',
    title: '',
    ref: '',
    dates: '',
    cost: 500,
    status: 'Planificado'
  });

  const totalCost = data.honeymoon.items.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);

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
          <h2 className="module-title font-serif">Luna de Miel: {data.honeymoon.destination}</h2>
          <p className="honeymoon-dates">
            📅 {data.honeymoon.dates} • Presupuesto asignado: ${data.honeymoon.budget.toLocaleString()} USD
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Añadir Reserva / Actividad
        </button>
      </div>

      {/* TARJETA DESTINO DESTACADO */}
      <div className="destination-banner card-burgundy">
        <div className="destination-content">
          <span className="tag-honeymoon">PRIMER VIAJE COMO ESPOSOS</span>
          <h3 className="dest-title font-serif">Ruta Romántica por Italia</h3>
          <p className="dest-sub font-display">
            Roma antigua • Paseos costeros por Positano y Ravello • Velero al atardecer en Capri
          </p>
          <div className="cost-summary-pill">
            <span>Inversión Estimada: <strong>${totalCost.toLocaleString()} USD</strong></span>
          </div>
        </div>
      </div>

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
              <div className="card-top-type">
                <div className="type-icon-circle">
                  <Icon size={18} />
                </div>
                <span className="type-name">{item.type}</span>
                <span className="status-pill-small">{item.status}</span>
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
                <span className="item-cost font-serif">${item.cost.toLocaleString()} USD</span>
                <span className="badge-gold badge">Reserva Lista</span>
              </div>
            </div>
          );
        })}
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
