import React, { useState } from 'react';
import { Utensils, Wine, Plus, Trash2, Edit2, Check, Sparkles, AlertCircle, Heart, Coffee, ShieldCheck } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const CateringManager = () => {
  const { data, updateCatering, addMenuItem, deleteMenuItem } = useWedding();
  const [activeSection, setActiveSection] = useState('mainCourses'); // 'cocktail' | 'mainCourses' | 'desserts' | 'sweetTable' | 'lateNight' | 'openBar'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState('Tradicional');

  const catering = data.catering || {
    format: "Catering de 3 pasos (Recepción / Entrada, Plato Principal y Postre) + Mesa Dulce y Fin de fiesta",
    cocktail: [],
    mainCourses: [],
    desserts: [],
    sweetTable: [],
    lateNight: [],
    openBar: []
  };

  // Conteo de requerimientos dietéticos de los invitados
  const dietaryStats = (data.guests || []).reduce((acc, g) => {
    const isConfirmed = g.status === 'Confirmado' || g.rsvpStatus === 'CONFIRMED';
    const totalCount = 1 + (g.companions || g.plusOnesConfirmed || 0);

    const menu = (g.menu || '').toLowerCase();
    const restrictions = Array.isArray(g.dietaryRestrictions) ? g.dietaryRestrictions.join(' ').toLowerCase() : '';

    if (restrictions.includes('celiac') || restrictions.includes('tacc') || menu.includes('celíaco') || menu.includes('tacc')) {
      acc.celiac += totalCount;
    } else if (restrictions.includes('vegan') || menu.includes('vegano')) {
      acc.vegan += totalCount;
    } else if (restrictions.includes('vegetarian') || menu.includes('vegetariano')) {
      acc.vegetarian += totalCount;
    } else if (menu.includes('infantil') || menu.includes('niño')) {
      acc.kids += totalCount;
    } else {
      acc.traditional += totalCount;
    }

    if (isConfirmed) acc.confirmedTotal += totalCount;
    acc.total += totalCount;
    return acc;
  }, { total: 0, confirmedTotal: 0, traditional: 0, celiac: 0, vegetarian: 0, vegan: 0, kids: 0 });

  const sectionsConfig = [
    { id: 'cocktail', title: '1. Recepción & Finger Food', icon: '🥂', kicker: 'Jardines de Entrada (18:00 - 20:00)' },
    { id: 'mainCourses', title: '2. Platos Principales', icon: '🥩', kicker: 'Cena de Salón (20:30)' },
    { id: 'desserts', title: '3. Postre Emplatado', icon: '🍨', kicker: 'Cierre del Menú Principal' },
    { id: 'sweetTable', title: '4. Mesa Dulce & Torta Nupcial', icon: '🎂', kicker: 'Junto a la Pista de Baile' },
    { id: 'lateNight', title: '5. Fin de Fiesta (Trasnoche)', icon: '🍔', kicker: 'Recarga de energía de madrugada (03:00)' },
    { id: 'openBar', title: '6. Barra Libre & Bebidas', icon: '🍸', kicker: 'Barra libre durante toda la velada' },
  ];

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    addMenuItem(activeSection, {
      title: newItemTitle.trim(),
      type: newItemType,
      category: newItemType
    });
    setNewItemTitle('');
    setShowAddModal(false);
  };

  const currentItems = catering[activeSection] || [];
  const activeConfig = sectionsConfig.find(s => s.id === activeSection);

  return (
    <div className="catering-container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* CABECERA PRINCIPAL */}
      <div className="module-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="module-kicker" style={{ color: 'var(--gold-600)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>
            BANQUETE Y EXPERIENCIA GASTRONÓMICA
          </span>
          <h2 className="module-title font-serif" style={{ color: 'var(--burgundy-900)', fontSize: '2.2rem', margin: '0.2rem 0' }}>
            ¿Qué vamos a comer? — Menú de Bodas
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Palacio San Souci • {catering.format}
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem' }}
        >
          <Plus size={18} /> Agregar Plato / Bebida
        </button>
      </div>

      {/* TARJETA RESUMEN DE RESTRICCIONES ALIMENTARIAS (INTEGRADA CON INVITADOS) */}
      <div className="card-luxury" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, #FFFDFB 0%, #FBF6F0 100%)', border: '1px solid var(--border-gold)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ShieldCheck size={20} color="var(--burgundy-700)" />
          <h4 className="font-serif" style={{ color: 'var(--burgundy-800)', margin: 0, fontSize: '1.2rem' }}>
            Balance de Preferencias y Menús Especiales ({dietaryStats.total} personas contempladas)
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#FFF', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid var(--burgundy-700)', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TRADICIONAL</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--burgundy-900)' }}>{dietaryStats.traditional}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Menú principal de autor</span>
          </div>

          <div style={{ background: '#FFF', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #D97706', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SIN TACC / CELÍACOS</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#D97706' }}>{dietaryStats.celiac}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Manipulación aislada</span>
          </div>

          <div style={{ background: '#FFF', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #059669', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>VEGETARIANOS / VEGANOS</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#059669' }}>{dietaryStats.vegetarian + dietaryStats.vegan}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Platos basados en plantas</span>
          </div>

          <div style={{ background: '#FFF', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #2563EB', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MENÚ INFANTIL</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2563EB' }}>{dietaryStats.kids}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Milanesitas y papas</span>
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN POR PASOS DEL MENÚ */}
      <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.8rem' }}>
        {sectionsConfig.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              padding: '0.75rem 1.2rem',
              borderRadius: '12px',
              border: activeSection === sec.id ? '2px solid var(--burgundy-700)' : '1px solid #E5DFD7',
              background: activeSection === sec.id ? 'var(--burgundy-700)' : '#FFF',
              color: activeSection === sec.id ? '#FFF' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: activeSection === sec.id ? '0 4px 12px rgba(103, 0, 26, 0.2)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{sec.icon}</span>
            <span>{sec.title}</span>
            <span style={{
              background: activeSection === sec.id ? 'rgba(255,255,255,0.25)' : '#F0EAE1',
              padding: '0.15rem 0.5rem',
              borderRadius: '20px',
              fontSize: '0.75rem'
            }}>
              {(catering[sec.id] || []).length}
            </span>
          </button>
        ))}
      </div>

      {/* LISTADO DE PLATOS DEL PASO SELECCIONADO */}
      <div className="card-luxury" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #EFE9E2', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-600)', fontWeight: 700, letterSpacing: '0.5px' }}>
              {activeConfig?.kicker}
            </span>
            <h3 className="font-serif" style={{ color: 'var(--burgundy-900)', fontSize: '1.6rem', margin: '0.2rem 0' }}>
              {activeConfig?.icon} {activeConfig?.title}
            </h3>
          </div>

          <button
            className="btn-secondary"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Agregar Opción
          </button>
        </div>

        {currentItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <Utensils size={40} color="var(--gold-500)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
            <h4 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--burgundy-800)', marginBottom: '0.4rem' }}>
              Aún no hay platos agregados en este paso
            </h4>
            <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              Define los platos o tragos que servirán en el banquete para tener todo acordado con el catering del Palacio.
            </p>
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Agregar Primer Plato
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {currentItems.map((item, index) => (
              <div
                key={item.id || index}
                style={{
                  background: '#FFF',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid #EDE7DF',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'transform 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: 'rgba(103, 0, 26, 0.08)',
                      color: 'var(--burgundy-700)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px'
                    }}>
                      {item.type || item.category || 'Opción Menú'}
                    </span>
                    <button
                      onClick={() => deleteMenuItem(activeSection, item.id)}
                      title="Eliminar plato"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', fontWeight: 600, lineHeight: 1.4 }}>
                    {item.title}
                  </h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid #F5EFEB', paddingTop: '0.6rem', marginTop: '0.8rem' }}>
                  <Sparkles size={14} color="var(--gold-500)" /> Aprobado para el banquete nupcial
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL PARA AGREGAR PLATO */}
      {showAddModal && (
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999 }}>
          <div className="modal-luxury card-luxury" style={{ maxWidth: '480px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-serif" style={{ color: 'var(--burgundy-800)', fontSize: '1.3rem', margin: 0 }}>
                Añadir al {activeConfig?.title}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Nombre del Plato / Preparación:
                </label>
                <textarea
                  className="input-luxury"
                  rows={3}
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Ej: Ojo de bife al Malbec con gratén de papas trufadas..."
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Categoría / Tipo de Plato:
                </label>
                <select
                  className="select-custom"
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  <option value="Tradicional">Tradicional / Carne</option>
                  <option value="Pescado">Pescado / Frutos de Mar</option>
                  <option value="Vegetariano">Vegetariano</option>
                  <option value="Vegano">Vegano</option>
                  <option value="Sin TACC">Celíaco / Sin TACC</option>
                  <option value="Menú Infantil">Menú Infantil</option>
                  <option value="Bebida / Trago">Bebida / Trago de Autor</option>
                  <option value="Postre">Postre / Mesa Dulce</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} /> Agregar al Menú
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CateringManager;
