import React, { useState } from 'react';
import { WeddingProvider } from './context/WeddingContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { GuestManagement } from './components/GuestManagement';
import { CollaborativeAlbum } from './components/CollaborativeAlbum';
import { InvitationsWebBuilder } from './components/InvitationsWebBuilder';
import { TodoList } from './components/TodoList';
import { FinanceVendors } from './components/FinanceVendors';
import { HoneymoonPlanner } from './components/HoneymoonPlanner';
import { AiAssistant } from './components/AiAssistant';
import { PublicWeddingWeb } from './components/PublicWeddingWeb';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('admin'); // 'admin' | 'public'

  return (
    <div className="app-layout">
      {/* Barra de Navegación Global */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Contenido Principal según el modo de vista */}
      <main className="main-content-area">
        {viewMode === 'public' ? (
          <PublicWeddingWeb 
            onNavigateToAlbum={() => {
              setViewMode('admin');
              setActiveTab('album');
            }} 
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                setActiveTab={setActiveTab} 
                setViewMode={setViewMode} 
              />
            )}
            {activeTab === 'guests' && <GuestManagement />}
            {activeTab === 'invitations' && (
              <InvitationsWebBuilder setViewMode={setViewMode} />
            )}
            {activeTab === 'album' && <CollaborativeAlbum />}
            {activeTab === 'tasks' && <TodoList />}
            {activeTab === 'finances' && <FinanceVendors />}
            {activeTab === 'honeymoon' && <HoneymoonPlanner />}
            {activeTab === 'ai' && <AiAssistant />}
          </>
        )}
      </main>

      {/* Pie de página elegante */}
      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-love">
            Diseñado con amor y distinción para <strong>Julián &amp; Yanet</strong> • 8 de Octubre de 2027
          </p>
          <span className="footer-palette-hint">
            Paleta Oficial: Borgoña Imperial &amp; Champagne Oro
          </span>
        </div>
      </footer>

      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--surface-cream);
        }
        .main-content-area {
          flex: 1;
        }
        .app-footer {
          background: linear-gradient(180deg, var(--bg-burgundy-900) 0%, var(--bg-burgundy-950) 100%);
          color: var(--champagne-200);
          border-top: 1px solid var(--border-gold-subtle);
          padding: 1.8rem 1rem;
          text-align: center;
          font-size: 0.85rem;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-love strong {
          color: var(--champagne-100);
          font-family: var(--font-serif);
        }
        .footer-palette-hint {
          display: block;
          font-size: 0.75rem;
          color: var(--gold-500);
          margin-top: 0.3rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <WeddingProvider>
      <AppContent />
    </WeddingProvider>
  );
}
