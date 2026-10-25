import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Heart, X, Check, Save } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const EditWeddingModal = ({ isOpen, onClose }) => {
  const { data, updateCouple } = useWedding();

  const [form, setForm] = useState({
    groom: data.couple?.groom || 'Julián',
    bride: data.couple?.bride || 'Yanet',
    date: data.couple?.date || '2027-10-09T18:00:00',
    venue: data.couple?.venue || 'Palacio San Souci / Jardines de la Reina',
    address: data.couple?.address || 'Av. Libertador 2450, San Fernando',
    totalBudget: data.couple?.totalBudget || 25000,
    currency: data.couple?.currency || 'USD',
    dressCode: data.couple?.dressCode || 'Elegante / Traje y Vestido de Fiesta',
    giftAlias: data.couple?.giftAlias || 'BODA.JULIAN.YANET',
    giftCbu: data.couple?.giftCbu || '0000003100012345678901',
    giftBank: data.couple?.giftBank || 'Banco Santander',
    giftAccountHolder: data.couple?.giftAccountHolder || 'Julián Sotelo / Yanet',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCouple({
      ...form,
      totalBudget: Number(form.totalBudget) || 25000,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999 }}>
      <div className="modal-luxury card-luxury" style={{ maxWidth: '580px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-gold-subtle)', paddingBottom: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-600)', letterSpacing: '1px' }}>
              CONFIGURACIÓN GENERAL
            </span>
            <h3 className="font-serif" style={{ color: 'var(--burgundy-800)', fontSize: '1.4rem', margin: '0.2rem 0 0 0' }}>
              Datos de los Novios y del Evento
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombres de los Novios */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Nombre del Novio:
              </label>
              <input
                type="text"
                className="input-luxury"
                value={form.groom}
                onChange={(e) => setForm({ ...form, groom: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Nombre de la Novia:
              </label>
              <input
                type="text"
                className="input-luxury"
                value={form.bride}
                onChange={(e) => setForm({ ...form, bride: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Fecha y Hora del Gran Día */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Fecha y Hora del Gran Día:
            </label>
            <input
              type="datetime-local"
              className="input-luxury"
              value={form.date ? form.date.slice(0, 16) : '2027-10-09T18:00'}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          {/* Lugar y Dirección */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Salón / Lugar de Celebración:
            </label>
            <input
              type="text"
              className="input-luxury"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="Ej. Palacio San Souci / Jardines de la Reina"
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Dirección:
            </label>
            <input
              type="text"
              className="input-luxury"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Ej. Av. Libertador 2450, San Fernando"
            />
          </div>

          {/* Código de Vestimenta (Dress Code) */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Código de Vestimenta (Dress Code):
            </label>
            <input
              type="text"
              className="input-luxury"
              value={form.dressCode}
              onChange={(e) => setForm({ ...form, dressCode: e.target.value })}
              placeholder="Ej. Elegante / Black Tie / Traje y Vestido largo"
            />
          </div>

          {/* Presupuesto Total */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Presupuesto Total Estimado:
              </label>
              <input
                type="number"
                className="input-luxury"
                value={form.totalBudget}
                onChange={(e) => setForm({ ...form, totalBudget: Number(e.target.value) })}
                min="0"
                step="500"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Moneda:
              </label>
              <select
                className="select-custom"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                style={{ width: '100%', padding: '0.65rem' }}
              >
                <option value="USD">USD ($)</option>
                <option value="ARS">ARS ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* Datos Bancarios / Regalos */}
          <div style={{ background: '#FAF6F0', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-gold-subtle)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--burgundy-800)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.6rem' }}>
              🎁 DATOS BANCARIOS PARA REGALOS (RSVP & WEB PÚBLICA)
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.6rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                  Alias Bancario:
                </label>
                <input
                  type="text"
                  className="input-luxury"
                  value={form.giftAlias}
                  onChange={(e) => setForm({ ...form, giftAlias: e.target.value })}
                  placeholder="BODA.JULIAN.YANET"
                  style={{ background: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                  Banco / Billetera:
                </label>
                <input
                  type="text"
                  className="input-luxury"
                  value={form.giftBank}
                  onChange={(e) => setForm({ ...form, giftBank: e.target.value })}
                  placeholder="Banco Santander / Mercado Pago"
                  style={{ background: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                  CBU / CVU:
                </label>
                <input
                  type="text"
                  className="input-luxury"
                  value={form.giftCbu}
                  onChange={(e) => setForm({ ...form, giftCbu: e.target.value })}
                  placeholder="0000003100012345678901"
                  style={{ background: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                  Titular de la Cuenta:
                </label>
                <input
                  type="text"
                  className="input-luxury"
                  value={form.giftAccountHolder}
                  onChange={(e) => setForm({ ...form, giftAccountHolder: e.target.value })}
                  placeholder="Julián Sotelo / Yanet"
                  style={{ background: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-gold-subtle)', paddingTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '150px', justifyContent: 'center' }}>
              {saveSuccess ? (
                <>
                  <Check size={18} /> ¡Actualizado!
                </>
              ) : (
                <>
                  <Save size={18} /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWeddingModal;
