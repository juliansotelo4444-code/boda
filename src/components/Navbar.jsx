import React, { useState } from 'react';
import { Heart, Bell, Eye, LayoutDashboard, Users, Image as ImageIcon, CheckSquare, DollarSign, Compass, Sparkles, Mail, RotateCcw, Utensils, Camera } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { ProfilePhotoModal } from './ProfilePhotoModal';

export const Navbar = ({ activeTab, setActiveTab, viewMode, setViewMode }) => {
  const { data, requestNotificationPermission, notificationPermission, sendTestNotification, resetToZero } = useWedding();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'guests', label: 'Invitados & Mesas', icon: Users },
    { id: 'catering', label: 'Menú & Banquete', icon: Utensils },
    { id: 'invitations', label: 'Invitación & Web', icon: Mail },
    { id: 'album', label: 'Álbum en Vivo', icon: ImageIcon },
    { id: 'tasks', label: 'Cronograma', icon: CheckSquare },
    { id: 'finances', label: 'Presupuesto', icon: DollarSign },
    { id: 'honeymoon', label: 'Luna de Miel', icon: Compass },
    { id: 'ai', label: 'Asistente IA', icon: Sparkles }
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <div className="brand-wrap" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="rings-badge">💍</div>
          <div>
            <span className="brand-subtitle">NUESTRO GRAN DÍA</span>
            <h1 className="brand-title">Julián &amp; Yanet</h1>
          </div>
        </div>

        {/* Selector de Perspectiva (Novios vs Invitados) */}
        <div className="view-mode-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'admin' ? 'active' : ''}`}
            onClick={() => setViewMode('admin')}
          >
            Panel de Novios
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'public' ? 'active' : ''}`}
            onClick={() => setViewMode('public')}
          >
            <Eye size={15} /> Ver Web de Invitados
          </button>
        </div>

        {/* Acciones de Cabecera */}
        <div className="header-actions">
          <button 
            className="notification-pill"
            title="Reiniciar todos los datos de ejemplo y empezar limpio"
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar todos los datos a cero? Se vaciarán los invitados, fotos y gastos de prueba.')) {
                resetToZero();
              }
            }}
          >
            <RotateCcw size={15} />
            <span>Iniciar de cero</span>
          </button>

          <button 
            className="notification-pill"
            title="Activar o probar notificaciones push"
            onClick={async () => {
              if (notificationPermission !== 'granted') {
                await requestNotificationPermission();
              } else {
                sendTestNotification(
                  'Recordatorio para Julián & Yanet 💍',
                  'Se acerca la fecha límite para la seña del Salón y Jardines (18 de Octubre).'
                );
              }
            }}
          >
            <Bell size={16} />
            <span>{notificationPermission === 'granted' ? 'Push Activo' : 'Activar Alertas'}</span>
          </button>

          <div
            className="couple-avatar-wrap"
            onClick={() => setIsPhotoModalOpen(true)}
            title="Haz clic para cambiar la foto de perfil o portada"
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <img
              src={data.couple?.avatarUrl || '/assets/couple.jpg'}
              alt="Julián & Yanet"
              className="couple-avatar-img"
            />
            <div className="couple-tag">9 Oct 2027</div>
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              background: 'var(--burgundy-700)',
              color: '#FFF',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--gold-400)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
            }}>
              <Camera size={10} />
            </div>
          </div>
        </div>
      </div>

      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      {/* Barra de Pestañas (Solo visible en Modo Administración de Novios) */}
      {viewMode === 'admin' && (
        <nav className="nav-tabs-bar">
          <div className="nav-tabs-scroll">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`nav-tab-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <style>{`
        .navbar-container {
          background: linear-gradient(180deg, var(--bg-burgundy-950) 0%, var(--bg-burgundy-900) 100%);
          color: var(--champagne-100);
          border-bottom: 2px solid var(--gold-500);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .navbar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 2rem;
          max-width: 1440px;
          margin: 0 auto;
          gap: 1.5rem;
        }
        .brand-wrap {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }
        .rings-badge {
          width: 44px;
          height: 44px;
          background: rgba(245, 230, 200, 0.12);
          border: 1px solid var(--gold-500);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.25);
        }
        .brand-subtitle {
          font-size: 0.68rem;
          letter-spacing: 0.25em;
          color: var(--champagne-300);
          text-transform: uppercase;
          display: block;
          font-weight: 600;
        }
        .brand-title {
          font-size: 1.45rem;
          margin: 0;
          color: var(--champagne-100);
          font-family: var(--font-serif);
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .view-mode-toggle {
          background: rgba(20, 5, 8, 0.65);
          padding: 4px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-gold-subtle);
          display: flex;
          gap: 4px;
        }
        .toggle-btn {
          padding: 0.45rem 1.1rem;
          border-radius: var(--radius-pill);
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--champagne-200);
          background: transparent;
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .toggle-btn.active {
          background: linear-gradient(135deg, var(--champagne-200) 0%, var(--gold-500) 100%);
          color: var(--bg-burgundy-950);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .notification-pill {
          background: rgba(245, 230, 200, 0.08);
          border: 1px solid var(--border-gold-subtle);
          color: var(--champagne-200);
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-pill);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-weight: 500;
        }
        .notification-pill:hover {
          background: rgba(245, 230, 200, 0.18);
          border-color: var(--champagne-300);
        }
        .couple-avatar-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .couple-avatar-img {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--gold-500);
        }
        .couple-tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--champagne-300);
          background: rgba(255, 255, 255, 0.08);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
        }
        .nav-tabs-bar {
          background: rgba(46, 5, 16, 0.95);
          border-top: 1px solid rgba(197, 160, 89, 0.2);
          overflow-x: auto;
        }
        .nav-tabs-scroll {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          padding: 0 1.5rem;
          gap: 0.5rem;
        }
        .nav-tab-item {
          background: transparent;
          color: rgba(247, 241, 228, 0.7);
          padding: 0.75rem 1.1rem;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }
        .nav-tab-item:hover {
          color: var(--champagne-200);
          background: rgba(255, 255, 255, 0.04);
        }
        .nav-tab-item.active {
          color: var(--champagne-200);
          font-weight: 700;
          border-bottom-color: var(--gold-500);
          background: rgba(245, 230, 200, 0.08);
        }
        @media (max-width: 900px) {
          .navbar-top {
            padding: 0.7rem 1rem;
            flex-wrap: wrap;
          }
          .couple-tag {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
