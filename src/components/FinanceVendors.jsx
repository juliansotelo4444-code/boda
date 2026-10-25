import React, { useState } from 'react';
import { DollarSign, Plus, FileText, Phone, Mail, ExternalLink, Check, AlertTriangle, ArrowUpRight, Trash2, Edit2, X, Save } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const FinanceVendors = () => {
  const { data, addPayment, deletePayment, addBudgetItem, updateBudgetItem, deleteBudgetItem, addVendor, updateVendor, deleteVendor } = useWedding();
  const [activeTab, setActiveTab] = useState('budget'); // 'budget' | 'vendors'
  const [selectedBudgetItemForPayment, setSelectedBudgetItemForPayment] = useState(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpenseForm, setNewExpenseForm] = useState({ category: 'Catering & Bebidas', vendor: '', agreed: 1000, notes: '' });
  const [editingExpense, setEditingExpense] = useState(null);

  // Estados Directorio de Proveedores (CRUD)
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [newVendorForm, setNewVendorForm] = useState({
    name: '',
    category: 'Catering & Bebidas',
    phone: '',
    email: '',
    status: 'Confirmado',
    contractUrl: 'Contrato.pdf',
    notes: ''
  });

  // Formulario nuevo pago
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentConcept, setPaymentConcept] = useState('Segundo pago seña');
  const [paymentDate, setPaymentDate] = useState('2026-10-15');

  const totalBudget = data.couple?.totalBudget || 25000;
  const totalAgreed = data.budgetItems.reduce((acc, curr) => acc + (curr.agreed || curr.estimated || 0), 0);
  const totalPaid = data.budgetItems.reduce((acc, curr) => acc + (curr.paid || 0), 0);
  const totalRemaining = totalAgreed - totalPaid;

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedBudgetItemForPayment || !paymentAmount) return;
    addPayment(selectedBudgetItemForPayment.id, {
      amount: parseFloat(paymentAmount),
      concept: paymentConcept,
      date: paymentDate,
      receipt: `REC-${Math.floor(1000 + Math.random() * 9000)}.pdf`
    });
    setSelectedBudgetItemForPayment(null);
    setPaymentAmount('');
  };

  return (
    <div className="finance-module-container animate-fade-in">
      <div className="module-top-bar">
        <div>
          <span className="module-kicker">CONTROL ECONÓMICO Y CONTRATOS</span>
          <h2 className="module-title font-serif">Finanzas y Directorio de Proveedores</h2>
        </div>

        <div className="subtabs-pill">
          <button 
            className={`subtab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <DollarSign size={16} /> Presupuesto &amp; Pagos Parciales
          </button>
          <button 
            className={`subtab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            <FileText size={16} /> Directorio de Proveedores
          </button>
        </div>
      </div>

      {/* METRICAS TOTALES */}
      <div className="finance-stats-grid">
        <div className="card-luxury stat-box">
          <span className="stat-label">Presupuesto Asignado</span>
          <strong className="stat-val font-serif">${totalBudget.toLocaleString()} USD</strong>
          <span className="stat-sub-text">Fijado para la boda</span>
        </div>
        <div className="card-luxury stat-box">
          <span className="stat-label">Total Acordado con Proveedores</span>
          <strong className="stat-val font-serif">${totalAgreed.toLocaleString()} USD</strong>
          <span className="stat-sub-text">{Math.round((totalAgreed/totalBudget)*100)}% del total</span>
        </div>
        <div className="card-luxury stat-box">
          <span className="stat-label">Total Efectivamente Pagado</span>
          <strong className="stat-val font-serif text-burgundy">${totalPaid.toLocaleString()} USD</strong>
          <span className="stat-sub-text">Señas y anticipos transferidos</span>
        </div>
        <div className="card-luxury stat-box">
          <span className="stat-label">Saldo Pendiente de Pago</span>
          <strong className="stat-val font-serif text-gold">${totalRemaining.toLocaleString()} USD</strong>
          <span className="stat-sub-text">Por liquidar antes del evento</span>
        </div>
      </div>

      {/* TAB 1: PRESUPUESTO & PAGOS */}
      {activeTab === 'budget' && (
        <div className="budget-section card-luxury">
          <div className="section-head-flex">
            <h3 className="font-serif">Desglose de Gastos y Pagos Parciales</h3>
            <button 
              className="btn-primary btn-sm"
              onClick={() => setShowAddExpenseModal(true)}
            >
              + Añadir Rubro al Presupuesto
            </button>
          </div>

          {data.budgetItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
              <DollarSign size={44} color="var(--gold-500)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
              <h4 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--burgundy-700)', marginBottom: '0.5rem' }}>
                Aún no has registrado rubros en el presupuesto
              </h4>
              <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Comienza cargando los costos acordados de tus proveedores (Catering, Salón, Fotografía) para registrar pagos parciales y controlar tu saldo disponible.
              </p>
              <button 
                className="btn-primary"
                onClick={() => setShowAddExpenseModal(true)}
              >
                + Añadir Primer Rubro
              </button>
            </div>
          ) : (
            <div className="budget-items-list">
              {data.budgetItems.map(item => {
                const pending = (item.agreed || item.estimated) - item.paid;
                const percentPaid = Math.round((item.paid / (item.agreed || item.estimated)) * 100);

                return (
                  <div key={item.id} className="budget-item-card">
                    <div className="item-main-header">
                      <div>
                        <span className="item-category-tag">{item.category}</span>
                        <h4 className="item-vendor-name">{item.vendor}</h4>
                        {item.notes && <p className="item-notes">📝 {item.notes}</p>}
                      </div>

                      <div className="item-amounts">
                        <div className="amount-group">
                          <span className="lbl">Total Acordado:</span>
                          <strong>${item.agreed.toLocaleString()} USD</strong>
                        </div>
                        <div className="amount-group">
                          <span className="lbl">Pagado:</span>
                          <strong className="text-burgundy">${item.paid.toLocaleString()} USD ({percentPaid}%)</strong>
                        </div>
                        <div className="amount-group">
                          <span className="lbl">Resta Pagar:</span>
                          <strong className="text-gold">${pending.toLocaleString()} USD</strong>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className="btn-primary btn-sm"
                            onClick={() => setSelectedBudgetItemForPayment(item)}
                          >
                            + Pago
                          </button>
                          <button
                            className="btn-icon-subtle"
                            title="Editar rubro"
                            onClick={() => setEditingExpense(item)}
                            style={{ padding: '0.4rem' }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon-subtle"
                            title="Eliminar rubro"
                            onClick={() => {
                              if (window.confirm(`¿Estás seguro de eliminar el rubro "${item.vendor}" (${item.category})?`)) {
                                deleteBudgetItem(item.id);
                              }
                            }}
                            style={{ color: '#DC2626', padding: '0.4rem' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BARRITA DE PROGRESO DE PAGO */}
                    <div className="item-pay-progress">
                      <div className="item-pay-fill" style={{ width: `${percentPaid}%` }}></div>
                    </div>

                    {/* HISTORIAL DE PAGOS PARCIALES */}
                    {item.payments.length > 0 && (
                      <div className="payments-history">
                        <span className="history-title">Registro de pagos parciales realizados:</span>
                        <div className="payments-chips">
                          {item.payments.map(p => (
                            <div key={p.id} className="payment-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <span>📅 {p.date}</span>
                              <strong>${p.amount.toLocaleString()} USD</strong>
                              <small>({p.concept})</small>
                              <span className="receipt-link">📄 {p.receipt}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`¿Eliminar este comprobante de pago de $${p.amount}?`)) {
                                    deletePayment(item.id, p.id);
                                  }
                                }}
                                title="Eliminar pago"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', marginLeft: '0.3rem', fontSize: '0.85rem' }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DIRECTORIO DE PROVEEDORES */}
      {activeTab === 'vendors' && (
        <div className="card-luxury" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #EDE7DF', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <h3 className="font-serif" style={{ color: 'var(--burgundy-900)', fontSize: '1.5rem', margin: 0 }}>
                Directorio de Proveedores
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
                Contactos clave, teléfonos, estado de contrato y notas confidenciales de la boda.
              </p>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => setShowAddVendorModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.2rem' }}
            >
              <Plus size={16} /> + Añadir Proveedor
            </button>
          </div>

          {data.vendors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
              <FileText size={44} color="var(--gold-500)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
              <h4 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--burgundy-700)', marginBottom: '0.5rem' }}>
                Directorio de Proveedores Listo
              </h4>
              <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Aquí podrás registrar los datos de contacto, teléfonos, notas privadas y contratos en PDF de cada profesional contratado para la boda.
              </p>
              <button className="btn-primary" onClick={() => setShowAddVendorModal(true)}>
                <Plus size={16} /> Añadir Primer Proveedor
              </button>
            </div>
          ) : (
            <div className="vendors-grid">
              {data.vendors.map(vendor => (
                <div key={vendor.id} className="vendor-card card-luxury" style={{ position: 'relative' }}>
                  <div className="vendor-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge-burgundy badge">{vendor.category}</span>
                      <span className="status-contract-pill">✓ {vendor.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        className="btn-icon-subtle"
                        title="Editar proveedor"
                        onClick={() => setEditingVendor({ ...vendor })}
                        style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-icon-subtle danger"
                        title="Eliminar proveedor"
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de eliminar al proveedor "${vendor.name}"?`)) {
                            deleteVendor(vendor.id);
                          }
                        }}
                        style={{ color: '#DC2626', padding: '0.25rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h3 className="vendor-name font-serif" style={{ marginTop: '0.6rem' }}>{vendor.name}</h3>

                  <div className="vendor-contact-info">
                    <div className="contact-line">
                      <Phone size={14} /> <span>{vendor.phone || 'No registrado'}</span>
                    </div>
                    <div className="contact-line">
                      <Mail size={14} /> <span>{vendor.email || 'No registrado'}</span>
                    </div>
                  </div>

                  {vendor.contractUrl && (
                    <div className="vendor-contract-attachment">
                      <FileText size={16} color="var(--burgundy-700)" />
                      <span className="file-name">{vendor.contractUrl}</span>
                    </div>
                  )}

                  {vendor.notes && (
                    <div className="vendor-notes-box">
                      <span className="notes-lbl">Notas Privadas de los Novios:</span>
                      <p>{vendor.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL REGISTRAR PAGO PARCIAL */}
      {selectedBudgetItemForPayment && (
        <div className="modal-backdrop" onClick={() => setSelectedBudgetItemForPayment(null)}>
          <div className="modal-dialog card-luxury" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-serif">Registrar Pago a {selectedBudgetItemForPayment.vendor}</h3>
              <button className="btn-close" onClick={() => setSelectedBudgetItemForPayment(null)}>✕</button>
            </div>
            <form onSubmit={handleRecordPayment} className="modal-form">
              <div className="form-group">
                <label>Monto a Registrar (USD) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required
                  placeholder="Ej. 1500"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Concepto del Pago *</label>
                <input 
                  type="text" 
                  required
                  value={paymentConcept}
                  onChange={e => setPaymentConcept(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Fecha del Pago *</label>
                <input 
                  type="date" 
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setSelectedBudgetItemForPayment(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AGREGAR RUBRO AL PRESUPUESTO */}
      {showAddExpenseModal && (
        <div className="modal-backdrop" onClick={() => setShowAddExpenseModal(false)}>
          <div className="modal-dialog card-luxury" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-serif">Añadir Rubro al Presupuesto</h3>
              <button className="btn-close" onClick={() => setShowAddExpenseModal(false)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addBudgetItem(newExpenseForm);
              setNewExpenseForm({ category: 'Catering & Bebidas', vendor: '', agreed: 1000, notes: '' });
              setShowAddExpenseModal(false);
            }} className="modal-form">
              <div className="form-group">
                <label>Categoría del Gasto *</label>
                <select
                  className="select-custom"
                  value={newExpenseForm.category}
                  onChange={e => setNewExpenseForm({ ...newExpenseForm, category: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  <option value="Salón & Jardines">Salón & Jardines</option>
                  <option value="Catering & Bebidas">Catering & Bebidas</option>
                  <option value="Fotografía & Video">Fotografía & Video</option>
                  <option value="DJ, Música & Luces">DJ, Música & Luces</option>
                  <option value="Vestimenta & Estilo">Vestimenta & Estilo</option>
                  <option value="Ambientación & Flores">Ambientación & Flores</option>
                  <option value="Invitaciones & Papelería">Invitaciones & Papelería</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nombre del Proveedor o Servicio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Catering Palacio San Souci"
                  value={newExpenseForm.vendor}
                  onChange={e => setNewExpenseForm({ ...newExpenseForm, vendor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Monto Total Acordado (USD) *</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  required
                  value={newExpenseForm.agreed}
                  onChange={e => setNewExpenseForm({ ...newExpenseForm, agreed: Number(e.target.value), estimated: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Notas / Condiciones de Pago</label>
                <textarea
                  rows="2"
                  placeholder="Seña 30%, saldo 15 días antes del evento..."
                  value={newExpenseForm.notes}
                  onChange={e => setNewExpenseForm({ ...newExpenseForm, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowAddExpenseModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Rubro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR RUBRO EXISTENTE */}
      {editingExpense && (
        <div className="modal-backdrop" onClick={() => setEditingExpense(null)}>
          <div className="modal-dialog card-luxury" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-serif">Editar Rubro del Presupuesto</h3>
              <button className="btn-close" onClick={() => setEditingExpense(null)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateBudgetItem(editingExpense.id, editingExpense);
              setEditingExpense(null);
            }} className="modal-form">
              <div className="form-group">
                <label>Categoría</label>
                <select
                  className="select-custom"
                  value={editingExpense.category}
                  onChange={e => setEditingExpense({ ...editingExpense, category: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  <option value="Salón & Jardines">Salón & Jardines</option>
                  <option value="Catering & Bebidas">Catering & Bebidas</option>
                  <option value="Fotografía & Video">Fotografía & Video</option>
                  <option value="DJ, Música & Luces">DJ, Música & Luces</option>
                  <option value="Vestimenta & Estilo">Vestimenta & Estilo</option>
                  <option value="Ambientación & Flores">Ambientación & Flores</option>
                  <option value="Invitaciones & Papelería">Invitaciones & Papelería</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="form-group">
                <label>Proveedor / Concepto</label>
                <input
                  type="text"
                  required
                  value={editingExpense.vendor}
                  onChange={e => setEditingExpense({ ...editingExpense, vendor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Monto Total Acordado (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  required
                  value={editingExpense.agreed}
                  onChange={e => setEditingExpense({ ...editingExpense, agreed: Number(e.target.value), estimated: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Notas</label>
                <textarea
                  rows="2"
                  value={editingExpense.notes || ''}
                  onChange={e => setEditingExpense({ ...editingExpense, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setEditingExpense(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">Actualizar Rubro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AÑADIR NUEVO PROVEEDOR */}
      {showAddVendorModal && (
        <div className="modal-backdrop" onClick={() => setShowAddVendorModal(false)}>
          <div className="modal-dialog card-luxury" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="font-serif">Añadir Nuevo Proveedor</h3>
              <button className="btn-close" onClick={() => setShowAddVendorModal(false)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addVendor(newVendorForm);
              setNewVendorForm({
                name: '',
                category: 'Catering & Bebidas',
                phone: '',
                email: '',
                status: 'Confirmado',
                contractUrl: 'Contrato.pdf',
                notes: ''
              });
              setShowAddVendorModal(false);
            }} className="modal-form">
              <div className="form-group">
                <label>Nombre de la Empresa / Profesional *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Estudio Fotográfico Lumière"
                  value={newVendorForm.name}
                  onChange={e => setNewVendorForm({ ...newVendorForm, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rubro / Especialidad *</label>
                  <select 
                    className="select-custom"
                    value={newVendorForm.category}
                    onChange={e => setNewVendorForm({ ...newVendorForm, category: e.target.value })}
                  >
                    <option value="Salón & Jardines">Salón & Jardines</option>
                    <option value="Catering & Bebidas">Catering & Bebidas</option>
                    <option value="Fotografía & Video">Fotografía & Video</option>
                    <option value="DJ & Iluminación">DJ & Iluminación</option>
                    <option value="Ambientación & Flores">Ambientación & Flores</option>
                    <option value="Vestimenta Nupcial">Vestimenta Nupcial</option>
                    <option value="Música en Vivo">Música en Vivo</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado del Contrato</label>
                  <select 
                    className="select-custom"
                    value={newVendorForm.status}
                    onChange={e => setNewVendorForm({ ...newVendorForm, status: e.target.value })}
                  >
                    <option value="Confirmado">Confirmado</option>
                    <option value="En Negociación">En Negociación</option>
                    <option value="Presupuestado">Presupuestado</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono / WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="+54 9 11 ..."
                    value={newVendorForm.phone}
                    onChange={e => setNewVendorForm({ ...newVendorForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email de Contacto</label>
                  <input 
                    type="email" 
                    placeholder="contacto@proveedor.com"
                    value={newVendorForm.email}
                    onChange={e => setNewVendorForm({ ...newVendorForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notas Privadas / Acuerdos</label>
                <textarea 
                  rows="2"
                  placeholder="Incluye fotolibro de regalo, 2 fotógrafos presentes..."
                  value={newVendorForm.notes}
                  onChange={e => setNewVendorForm({ ...newVendorForm, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowAddVendorModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Proveedor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PROVEEDOR EXISTENTE */}
      {editingVendor && (
        <div className="modal-backdrop" onClick={() => setEditingVendor(null)}>
          <div className="modal-dialog card-luxury" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="font-serif">Editar Proveedor</h3>
              <button className="btn-close" onClick={() => setEditingVendor(null)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateVendor(editingVendor.id, editingVendor);
              setEditingVendor(null);
            }} className="modal-form">
              <div className="form-group">
                <label>Nombre de la Empresa / Profesional *</label>
                <input 
                  type="text" 
                  required
                  value={editingVendor.name}
                  onChange={e => setEditingVendor({ ...editingVendor, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rubro / Especialidad *</label>
                  <select 
                    className="select-custom"
                    value={editingVendor.category}
                    onChange={e => setEditingVendor({ ...editingVendor, category: e.target.value })}
                  >
                    <option value="Salón & Jardines">Salón & Jardines</option>
                    <option value="Catering & Bebidas">Catering & Bebidas</option>
                    <option value="Fotografía & Video">Fotografía & Video</option>
                    <option value="DJ & Iluminación">DJ & Iluminación</option>
                    <option value="Ambientación & Flores">Ambientación & Flores</option>
                    <option value="Vestimenta Nupcial">Vestimenta Nupcial</option>
                    <option value="Música en Vivo">Música en Vivo</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado del Contrato</label>
                  <select 
                    className="select-custom"
                    value={editingVendor.status}
                    onChange={e => setEditingVendor({ ...editingVendor, status: e.target.value })}
                  >
                    <option value="Confirmado">Confirmado</option>
                    <option value="En Negociación">En Negociación</option>
                    <option value="Presupuestado">Presupuestado</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono / WhatsApp</label>
                  <input 
                    type="text" 
                    value={editingVendor.phone || ''}
                    onChange={e => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email de Contacto</label>
                  <input 
                    type="email" 
                    value={editingVendor.email || ''}
                    onChange={e => setEditingVendor({ ...editingVendor, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notas Privadas / Acuerdos</label>
                <textarea 
                  rows="2"
                  value={editingVendor.notes || ''}
                  onChange={e => setEditingVendor({ ...editingVendor, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => {
                    if (window.confirm(`¿Estás seguro de eliminar al proveedor "${editingVendor.name}"?`)) {
                      deleteVendor(editingVendor.id);
                      setEditingVendor(null);
                    }
                  }}
                  style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                >
                  Eliminar Proveedor
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn-outline" onClick={() => setEditingVendor(null)}>Cancelar</button>
                  <button type="submit" className="btn-primary">Guardar Cambios</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .finance-module-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }
        .finance-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-box {
          padding: 1.5rem;
          background: white;
        }
        .stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.3rem;
        }
        .stat-val {
          font-size: 1.8rem;
          display: block;
          margin-bottom: 0.3rem;
          color: var(--bg-burgundy-900);
        }
        .stat-sub-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .text-burgundy { color: var(--burgundy-700); }
        .text-gold { color: #A0742A; }

        /* Presupuesto */
        .budget-section {
          padding: 2rem;
        }
        .section-head-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .budget-items-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .budget-item-card {
          border: 1px solid var(--border-gold-subtle);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          background: var(--surface-card-subtle);
        }
        .item-main-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .item-category-tag {
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--burgundy-600);
          font-weight: 700;
        }
        .item-vendor-name {
          font-size: 1.25rem;
          color: var(--bg-burgundy-900);
          margin: 0.2rem 0;
        }
        .item-notes {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .item-amounts {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .amount-group {
          text-align: right;
        }
        .amount-group .lbl {
          font-size: 0.72rem;
          display: block;
          color: var(--text-muted);
        }
        .amount-group strong {
          font-size: 0.95rem;
        }
        .item-pay-progress {
          height: 6px;
          background: #E8E2D8;
          border-radius: var(--radius-pill);
          overflow: hidden;
          margin: 1.2rem 0;
        }
        .item-pay-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold-500) 0%, var(--burgundy-700) 100%);
        }
        .payments-history {
          border-top: 1px dashed var(--border-gold-subtle);
          padding-top: 0.8rem;
        }
        .history-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--burgundy-700);
          display: block;
          margin-bottom: 0.5rem;
        }
        .payments-chips {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .payment-chip {
          background: white;
          border: 1px solid var(--border-gold-subtle);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .receipt-link {
          color: var(--burgundy-700);
          font-weight: 600;
        }

        /* Proveedores */
        .vendors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .vendor-card {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .vendor-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status-contract-pill {
          font-size: 0.75rem;
          color: #2E7D32;
          background: #E8F5E9;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-pill);
          font-weight: 700;
        }
        .vendor-name {
          font-size: 1.4rem;
          margin: 0;
          color: var(--bg-burgundy-900);
        }
        .vendor-contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .contact-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .vendor-contract-attachment {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--champagne-100);
          padding: 0.6rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          border: 1px solid var(--border-gold-subtle);
        }
        .file-name {
          flex: 1;
          font-weight: 600;
          color: var(--burgundy-700);
        }
        .vendor-notes-box {
          background: #FAF9F7;
          padding: 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
        }
        .notes-lbl {
          font-weight: 700;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.2rem;
        }

        @media (max-width: 900px) {
          .finance-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
