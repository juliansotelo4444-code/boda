import React, { useState } from 'react';
import { Mail, Share2, Copy, Check, Eye, Sparkles, Download, Palette } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const InvitationsWebBuilder = ({ setViewMode }) => {
  const { data } = useWedding();
  const [copiedLink, setCopiedLink] = useState(false);
  const [invitationText, setInvitationText] = useState(
    "Nos llena de felicidad invitarte a compartir con nosotros el día más esperado de nuestras vidas. Celebremos juntos nuestro amor y el inicio de esta nueva etapa."
  );
  const [invitationStyle, setInvitationStyle] = useState('burgundy-classic'); // 'burgundy-classic' | 'champagne-minimal'
  const [customGuestName, setCustomGuestName] = useState('Familia Rossi');

  const shareUrl = `${window.location.origin}/?invitado=${encodeURIComponent(customGuestName)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="invitations-module-container animate-fade-in">
      <div className="module-top-bar">
        <div>
          <span className="module-kicker">DISEÑO EDITORIAL &amp; DIFUSIÓN</span>
          <h2 className="module-title font-serif">Invitación Digital &amp; Web Oficial</h2>
          <p className="subtitle-text">
            Personaliza el mensaje, la estética de la tarjeta digital interactiva y comparte el enlace directo con los invitados de Julián y Yanet.
          </p>
        </div>

        <div className="action-buttons-top">
          <button className="btn-secondary" onClick={() => setViewMode('public')}>
            <Eye size={16} /> Previsualizar Web Pública
          </button>
        </div>
      </div>

      <div className="invitation-editor-grid">
        {/* PANEL DE CONFIGURACIÓN */}
        <div className="editor-controls card-luxury">
          <h3 className="controls-title font-serif">Configuración de la Invitación</h3>

          <div className="form-group">
            <label>Estilo Visual de la Tarjeta:</label>
            <div className="style-selector-pills">
              <button 
                className={`style-pill ${invitationStyle === 'burgundy-classic' ? 'active' : ''}`}
                onClick={() => setInvitationStyle('burgundy-classic')}
              >
                🍷 Borgoña Terciopelo
              </button>
              <button 
                className={`style-pill ${invitationStyle === 'champagne-minimal' ? 'active' : ''}`}
                onClick={() => setInvitationStyle('champagne-minimal')}
              >
                🥂 Champagne &amp; Oro
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Nombre del Invitado para Personalizar:</label>
            <input 
              type="text" 
              value={customGuestName}
              onChange={e => setCustomGuestName(e.target.value)}
              placeholder="Ej. Familia Rodríguez o Mariana Albarracín"
            />
          </div>

          <div className="form-group">
            <label>Texto Principal de la Dedicatoria:</label>
            <textarea 
              rows="4"
              value={invitationText}
              onChange={e => setInvitationText(e.target.value)}
            />
          </div>

          {/* COMPARTIR POR WHATSAPP O ENLACE */}
          <div className="share-box-section">
            <span className="share-label">Enlace personalizado listo para compartir:</span>
            <div className="share-link-input-wrap">
              <input type="text" readOnly value={shareUrl} />
              <button className="btn-primary btn-sm" onClick={handleCopyLink}>
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                {copiedLink ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <div className="quick-share-buttons">
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `¡Hola ${customGuestName}! Julián y Yanet te invitan a su boda el 8 de Octubre de 2027. Mira los detalles y confirma tu asistencia aquí: ${shareUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                <Share2 size={15} /> Compartir por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* PREVIEW EN VIVO DE LA INVITACIÓN DIGITAL */}
        <div className="invitation-preview-container">
          <div className={`digital-card-envelope ${invitationStyle}`}>
            <div className="card-ornament top-ornament">✦ ✦ ✦</div>
            <span className="card-kicker">INVITACIÓN DE BODA</span>
            
            <h1 className="card-couple-names font-serif">
              {data.couple.groom} &amp; {data.couple.bride}
            </h1>

            <div className="card-monogram">J &amp; Y</div>

            <div className="card-honored-guest">
              <span className="guest-prefix">Nos complace invitar especialmente a:</span>
              <strong className="guest-name-preview">{customGuestName || 'Estimado Invitado'}</strong>
            </div>

            <p className="card-message-body font-display">
              "{invitationText}"
            </p>

            <div className="card-date-badge">
              <div className="date-number">08</div>
              <div className="date-month-year">
                <span>OCTUBRE</span>
                <strong>2027</strong>
              </div>
            </div>

            <div className="card-venue-info">
              <p className="venue-name">{data.couple.venue}</p>
              <p className="venue-address">{data.couple.address}</p>
              <p className="venue-time">18:00 Horas • Recepción y Ceremonia</p>
            </div>

            <div className="card-footer-buttons">
              <button className="btn-rsvp-preview" onClick={() => setViewMode('public')}>
                Confirmar Asistencia (RSVP)
              </button>
            </div>

            <div className="card-ornament bottom-ornament">✦ ✦ ✦</div>
          </div>
        </div>
      </div>

      <style>{`
        .invitations-module-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }
        .subtitle-text {
          color: var(--text-secondary);
          margin-top: 0.3rem;
          font-size: 0.95rem;
        }
        .invitation-editor-grid {
          display: grid;
          grid-template-columns: 460px 1fr;
          gap: 2.5rem;
          margin-top: 1.5rem;
        }
        .editor-controls {
          padding: 2rem;
        }
        .controls-title {
          font-size: 1.3rem;
          margin-bottom: 1.2rem;
          color: var(--burgundy-700);
        }
        .style-selector-pills {
          display: flex;
          gap: 0.6rem;
        }
        .style-pill {
          flex: 1;
          padding: 0.6rem 0.8rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-gold-subtle);
          background: var(--surface-cream);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .style-pill.active {
          background: var(--burgundy-700);
          color: var(--champagne-200);
          border-color: var(--burgundy-700);
        }
        .share-box-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-gold-subtle);
        }
        .share-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--burgundy-700);
          display: block;
          margin-bottom: 0.5rem;
        }
        .share-link-input-wrap {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
        }
        .share-link-input-wrap input {
          flex: 1;
          padding: 0.5rem 0.8rem;
          border: 1px solid var(--border-gold-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          background: white;
        }
        .btn-whatsapp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: #25D366;
          color: white;
          padding: 0.7rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
        }
        .btn-whatsapp:hover {
          background: #1EBE5D;
        }

        /* Preview Digital Card */
        .invitation-preview-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .digital-card-envelope {
          width: 100%;
          max-width: 520px;
          border-radius: 20px;
          padding: 3.5rem 2.8rem;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 50px rgba(62, 10, 23, 0.25);
          transition: all 0.3s ease;
        }

        /* Estilo 1: Borgoña Clásico */
        .digital-card-envelope.burgundy-classic {
          background: linear-gradient(145deg, #4A0815 0%, #29040C 100%);
          color: var(--champagne-100);
          border: 2px solid var(--gold-500);
        }
        .digital-card-envelope.burgundy-classic .card-couple-names {
          color: #FFF9EE;
        }
        .digital-card-envelope.burgundy-classic .card-kicker {
          color: var(--champagne-300);
        }
        .digital-card-envelope.burgundy-classic .guest-name-preview {
          color: var(--champagne-200);
        }
        .digital-card-envelope.burgundy-classic .card-message-body {
          color: var(--champagne-100);
        }

        /* Estilo 2: Champagne & Oro */
        .digital-card-envelope.champagne-minimal {
          background: linear-gradient(145deg, #FFFDF8 0%, #F5E8D0 100%);
          color: var(--bg-burgundy-950);
          border: 2px solid var(--gold-600);
        }
        .digital-card-envelope.champagne-minimal .card-couple-names {
          color: var(--burgundy-700);
        }
        .digital-card-envelope.champagne-minimal .card-kicker {
          color: var(--gold-700);
        }
        .digital-card-envelope.champagne-minimal .guest-name-preview {
          color: var(--burgundy-700);
        }
        .digital-card-envelope.champagne-minimal .card-message-body {
          color: #4A3A3D;
        }

        .card-ornament {
          color: var(--gold-500);
          letter-spacing: 0.5em;
          font-size: 0.9rem;
        }
        .top-ornament { margin-bottom: 1.2rem; }
        .bottom-ornament { margin-top: 1.8rem; }
        .card-kicker {
          font-size: 0.72rem;
          letter-spacing: 0.25em;
          font-weight: 700;
          display: block;
          margin-bottom: 0.6rem;
        }
        .card-couple-names {
          font-size: 2.8rem;
          margin-bottom: 0.8rem;
          line-height: 1.1;
        }
        .card-monogram {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid var(--gold-500);
          margin: 0 auto 1.5rem auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 1.4rem;
          color: var(--gold-500);
          font-style: italic;
        }
        .card-honored-guest {
          background: rgba(255, 255, 255, 0.08);
          padding: 0.8rem 1.2rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          border: 1px dashed var(--border-gold-subtle);
        }
        .guest-prefix {
          font-size: 0.75rem;
          display: block;
          opacity: 0.85;
          margin-bottom: 0.2rem;
        }
        .guest-name-preview {
          font-size: 1.25rem;
          font-family: var(--font-serif);
        }
        .card-message-body {
          font-size: 1.25rem;
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 1.8rem;
        }
        .card-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          border-top: 1px solid var(--border-gold-subtle);
          border-bottom: 1px solid var(--border-gold-subtle);
          padding: 0.6rem 1.5rem;
          margin-bottom: 1.5rem;
        }
        .date-number {
          font-size: 2.4rem;
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--gold-500);
          line-height: 1;
        }
        .date-month-year {
          text-align: left;
          font-size: 0.75rem;
          line-height: 1.2;
        }
        .date-month-year span { display: block; letter-spacing: 0.15em; }
        .date-month-year strong { font-size: 1.1rem; color: var(--gold-500); }
        .card-venue-info {
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .venue-name { font-weight: 700; }
        .venue-address { opacity: 0.85; font-size: 0.82rem; }
        .venue-time { font-size: 0.78rem; opacity: 0.9; margin-top: 0.2rem; }
        .btn-rsvp-preview {
          background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%);
          color: var(--bg-burgundy-950);
          padding: 0.75rem 2rem;
          border-radius: var(--radius-pill);
          font-weight: 700;
          font-size: 0.95rem;
          box-shadow: 0 4px 15px rgba(197, 160, 89, 0.4);
        }
        .btn-rsvp-preview:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        @media (max-width: 900px) {
          .invitation-editor-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
