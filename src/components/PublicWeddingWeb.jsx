import React, { useState, useEffect } from 'react';
import { Heart, Music, Utensils, Camera, MapPin, Calendar, Clock, CheckCircle, ThumbsUp, Send, Sparkles, Trash2, Copy } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const PublicWeddingWeb = ({ onNavigateToAlbum }) => {
  const { data, addGuest, addSong, voteSong, deleteSong, addPhoto } = useWedding();
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpData, setRsvpData] = useState({
    name: '',
    phone: '',
    status: 'Confirmado',
    companions: 0,
    menu: 'Tradicional'
  });

  // Formulario sugerencia de canciones
  const [songForm, setSongForm] = useState({ title: '', artist: '', requestedBy: '' });
  const [songSubmitted, setSongSubmitted] = useState(false);

  // Cuenta regresiva
  const weddingDateStr = data.couple?.date || '2027-10-09T18:00:00';
  const targetDate = new Date(weddingDateStr);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60)
        });
      }
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpData.name.trim()) return;
    addGuest(rsvpData);
    setRsvpSubmitted(true);
  };

  const handleSongSubmit = (e) => {
    e.preventDefault();
    if (!songForm.title.trim() || !songForm.artist.trim()) return;
    addSong(songForm);
    setSongForm({ title: '', artist: '', requestedBy: '' });
    setSongSubmitted(true);
    setTimeout(() => setSongSubmitted(false), 3000);
  };

  const menuOptions = [
    {
      id: 'Tradicional',
      title: 'Plato Tradicional de Autor',
      desc: 'Lomo en reducción de vino Malbec y frutos rojos del bosque, acompañado de papas bouchon doradas.',
      badge: 'Recomendación Chef'
    },
    {
      id: 'Vegetariano',
      title: 'Opción Vegetariana Gourmet',
      desc: 'Raviolones abiertos de calabaza asada, ricota de oveja y emulsión de salvia con avellanas tostadas.',
      badge: 'Vegetariano'
    },
    {
      id: 'Vegano',
      title: 'Opción Vegana Fina',
      desc: 'Risotto de hongos de pino y trufa con espárragos crocantes y velo de aceite de oliva virgen extra.',
      badge: 'Vegano'
    },
    {
      id: 'Celíaco',
      title: 'Menú Celíaco (Gluten-Free)',
      desc: 'Suprema al vacío con costra crocante de hierbas, vegetales glaseados al champagne y puré trufado.',
      badge: 'Sin TACC'
    },
    {
      id: 'Menú Infantil',
      title: 'Menú Infantil Especial',
      desc: 'Medallones tiernos crocantes con papas noisette y mini fondue de queso suave.',
      badge: 'Kids'
    }
  ];

  return (
    <div className="public-wedding-page animate-fade-in">
      {/* HERO ROMÁNTICO */}
      <section className="public-hero" style={{ backgroundImage: `url('${data.couple?.heroImageUrl || '/assets/hero-bg.jpg'}')` }}>
        <div className="public-hero-backdrop"></div>
        <div className="public-hero-content">
          <div className="rings-icon">💍</div>
          <span className="hero-eyebrow">¡NOS CASAMOS!</span>
          <h1 className="hero-names font-serif">{data.couple?.groom || 'Julián'} &amp; {data.couple?.bride || 'Yanet'}</h1>
          <p className="hero-date">Sábado 9 de Octubre de 2027 • 18:00 hs</p>
          <p className="hero-venue-tag">{data.couple?.venue || 'Palacio San Souci, Buenos Aires'}</p>

          <div className="public-countdown-pills">
            <div className="pill-item">
              <strong>{timeLeft.days}</strong>
              <span>Días</span>
            </div>
            <div className="pill-item">
              <strong>{timeLeft.hours}</strong>
              <span>Horas</span>
            </div>
            <div className="pill-item">
              <strong>{timeLeft.minutes}</strong>
              <span>Minutos</span>
            </div>
          </div>

          <a href="#rsvp-section" className="btn-secondary btn-hero-rsvp">
            Confirmar Mi Asistencia (RSVP)
          </a>
        </div>
      </section>

      <div className="public-content-container">
        {/* RETRATO DE LOS NOVIOS */}
        <section className="our-story-section card-luxury">
          <div className="story-grid">
            <div className="story-image-wrap">
              <img src={data.couple?.avatarUrl || data.couple?.heroImageUrl || '/assets/couple.jpg'} alt={`${data.couple?.groom} & ${data.couple?.bride}`} className="story-couple-photo" />
              <div className="photo-corner-badge">J &amp; Y • 2027</div>
            </div>
            <div className="story-text-wrap">
              <span className="section-kicker">NUESTRA HISTORIA</span>
              <h2 className="story-heading font-serif">Unidos para siempre</h2>
              <p className="story-paragraph font-display">
                "Hay momentos en la vida que son inolvidables, pero compartirlos con quienes más amamos los hace eternos. Los esperamos con el corazón abierto para brindar y bailar hasta el amanecer."
              </p>
              <div className="wedding-details-mini">
                <div className="detail-item">
                  <Calendar size={18} color="var(--burgundy-700)" />
                  <div>
                    <strong>Fecha</strong>
                    <span>9 de Octubre, 2027</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock size={18} color="var(--burgundy-700)" />
                  <div>
                    <strong>Horario</strong>
                    <span>18:00 hs Puntual</span>
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={18} color="var(--burgundy-700)" />
                  <div>
                    <strong>Lugar</strong>
                    <span>{data.couple?.venue || 'Palacio San Souci'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULARIO RSVP & PREFERENCIA DE MENÚ */}
        <section id="rsvp-section" className="rsvp-section-card card-luxury">
          <div className="section-header-center">
            <span className="section-kicker">CONFIRMACIÓN DE ASISTENCIA</span>
            <h2 className="section-title font-serif">Acompáñanos en Nuestro Gran Día</h2>
            <p className="section-subtitle">
              Por favor confirma antes del 1 de Agosto de 2027 para reservar tu lugar y plato en la recepción.
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="rsvp-success-banner">
              <CheckCircle size={48} color="var(--burgundy-700)" />
              <h3 className="font-serif">¡Gracias por confirmar, {rsvpData.name}!</h3>
              <p>Tu asistencia ha sido registrada con el menú: <strong>{rsvpData.menu}</strong>.</p>
              <p className="sub-note">¡Nos vemos muy pronto en la pista de baile! 🥂✨</p>
              <button className="btn-outline" onClick={() => setRsvpSubmitted(false)}>
                Modificar o enviar otra respuesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="rsvp-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre y Apellido Completo *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Martín Sánchez"
                    value={rsvpData.name}
                    onChange={e => setRsvpData({ ...rsvpData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono de Contacto (WhatsApp) *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="+54 9 11 ..."
                    value={rsvpData.phone}
                    onChange={e => setRsvpData({ ...rsvpData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>¿Asistirás a la boda?</label>
                  <select 
                    value={rsvpData.status}
                    onChange={e => setRsvpData({ ...rsvpData, status: e.target.value })}
                  >
                    <option value="Confirmado">¡Sí, allí estaré con mucha alegría! 🎉</option>
                    <option value="Rechazado">Lamentablemente no podré asistir 💔</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Acompañantes adicionales</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="5"
                    value={rsvpData.companions}
                    onChange={e => setRsvpData({ ...rsvpData, companions: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* SELECCIÓN DE MENÚ INTERACTIVO */}
              {rsvpData.status === 'Confirmado' && (
                <div className="menu-selector-section">
                  <div className="menu-selector-header">
                    <Utensils size={18} color="var(--burgundy-700)" />
                    <h4>Selecciona tu Preferencia de Menú Gastronómico</h4>
                  </div>
                  <div className="menu-cards-grid">
                    {menuOptions.map(opt => (
                      <div 
                        key={opt.id}
                        className={`menu-option-card ${rsvpData.menu === opt.id ? 'selected' : ''}`}
                        onClick={() => setRsvpData({ ...rsvpData, menu: opt.id })}
                      >
                        <div className="menu-option-top">
                          <span className="menu-badge">{opt.badge}</span>
                          <input 
                            type="radio" 
                            name="menu" 
                            checked={rsvpData.menu === opt.id} 
                            readOnly 
                          />
                        </div>
                        <strong className="menu-title">{opt.title}</strong>
                        <p className="menu-desc">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-submit-row">
                <button type="submit" className="btn-primary btn-lg">
                  Confirmar Asistencia Ahora
                </button>
              </div>
            </form>
          )}
        </section>

        {/* CAJA DE MÚSICA / SUGERENCIAS DE CANCIONES */}
        <section className="music-suggestions-section card-luxury">
          <div className="music-header">
            <div>
              <span className="section-kicker">LA FIESTA LA HACEMOS JUNTOS</span>
              <h2 className="section-title font-serif">¿Qué canción no puede faltar? 🎶</h2>
              <p className="section-subtitle">
                Comparte ese tema que te hará saltar a la pista de baile con Julián y Yanet.
              </p>
            </div>
            <div className="music-icon-wrap">
              <Music size={32} />
            </div>
          </div>

          <form onSubmit={handleSongSubmit} className="song-form">
            <div className="song-inputs-row">
              <input 
                type="text" 
                placeholder="Título de la Canción (ej. Vivir Mi Vida)"
                required
                value={songForm.title}
                onChange={e => setSongForm({ ...songForm, title: e.target.value })}
              />
              <input 
                type="text" 
                placeholder="Artista (ej. Marc Anthony)"
                required
                value={songForm.artist}
                onChange={e => setSongForm({ ...songForm, artist: e.target.value })}
              />
              <input 
                type="text" 
                placeholder="Tu Nombre"
                value={songForm.requestedBy}
                onChange={e => setSongForm({ ...songForm, requestedBy: e.target.value })}
              />
              <button type="submit" className="btn-primary">
                <Send size={15} /> Sugerir
              </button>
            </div>
          </form>

          {songSubmitted && (
            <div className="song-toast-success">
              ✓ ¡Canción enviada al repertorio de los novios!
            </div>
          )}

          {/* LISTA DE CANCIONES VOTABLES */}
          <div className="songs-playlist-preview">
            <span className="playlist-title">Canciones pedidas por los invitados:</span>
            {data.songs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '0.8rem 0' }}>
                Aún no hay canciones pedidas. ¡Sé el primero en sugerir un tema para bailar con Julián y Yanet!
              </p>
            ) : (
              <div className="songs-grid">
                {data.songs.map(song => (
                  <div key={song.id} className="song-pill-item">
                    <div className="song-info">
                      <span className="song-title-text">🎵 {song.title}</span>
                      <span className="song-artist-text">{song.artist} • <small>por {song.requestedBy}</small></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button 
                        className="vote-btn"
                        onClick={() => voteSong(song.id)}
                        title="¡Yo también quiero bailar este tema!"
                      >
                        <ThumbsUp size={13} /> {song.votes}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Quitar la canción "${song.title}" de la lista?`)) {
                            deleteSong(song.id);
                          }
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', padding: '0.2rem' }}
                        title="Eliminar canción"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* DRESS CODE & REGALOS / DATOS BANCARIOS */}
        <section className="card-luxury" style={{ padding: '2.5rem 2rem', marginBottom: '3rem' }}>
          <div className="section-header-center" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="section-kicker">INFORMACIÓN IMPORTANTE PARA INVITADOS</span>
            <h2 className="section-title font-serif">Dress Code &amp; Regalos</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* DRESS CODE */}
            <div style={{ background: '#FAF6F0', padding: '1.8rem', borderRadius: '14px', border: '1px solid var(--border-gold-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>✨👔👗</div>
              <h3 className="font-serif" style={{ color: 'var(--burgundy-800)', fontSize: '1.3rem', marginBottom: '0.4rem' }}>
                Código de Vestimenta
              </h3>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--burgundy-900)', margin: '0.4rem 0' }}>
                {data.couple?.dressCode || 'Elegante / Traje y Vestido de Fiesta'}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Acompáñanos luciendo tu mejor atuendo para una noche mágica e inolvidable.
              </p>
            </div>

            {/* CUENTA BANCARIA / REGALOS */}
            <div style={{ background: '#FAF6F0', padding: '1.8rem', borderRadius: '14px', border: '1px solid var(--border-gold-subtle)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>🎁💌</div>
                <h3 className="font-serif" style={{ color: 'var(--burgundy-800)', fontSize: '1.3rem', marginBottom: '0.4rem' }}>
                  Regalo de Bodas &amp; Luna de Miel
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Tu presencia es nuestro mejor regalo. Si deseas hacernos un presente o colaborar con nuestro viaje a Neuquén:
                </p>
              </div>

              <div style={{ background: '#FFF', padding: '1rem', borderRadius: '10px', border: '1px solid #EFE8DF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Alias:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <strong>{data.couple?.giftAlias || 'BODA.JULIAN.YANET'}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(data.couple?.giftAlias || 'BODA.JULIAN.YANET');
                        alert('¡Alias copiado al portapapeles!');
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--burgundy-700)', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>CBU:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <code style={{ fontSize: '0.8rem', background: '#F5EFEB', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{data.couple?.giftCbu || '0000003100012345678901'}</code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(data.couple?.giftCbu || '0000003100012345678901');
                        alert('¡CBU copiado al portapapeles!');
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--burgundy-700)', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span>Titular: <strong>{data.couple?.giftAccountHolder || 'Julián Sotelo / Yanet'}</strong></span>
                  <span>{data.couple?.giftBank || 'Banco Santander'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACCESO DIRECTO AL ÁLBUM LIVE EL DÍA DE LA BODA */}
        <section className="album-promo-banner card-burgundy">
          <div className="album-promo-content">
            <Camera size={44} color="var(--champagne-200)" />
            <h2 className="album-promo-title font-serif">Álbum de Recuerdos en Vivo</h2>
            <p className="album-promo-sub">
              El día de la fiesta, saca tus fotos y súbelas aquí en tiempo real para verlas reflejadas en la pantalla del salón sin necesidad de crear cuenta.
            </p>
            <button className="btn-secondary" onClick={onNavigateToAlbum}>
              Ir al Álbum de Fotos en Vivo
            </button>
          </div>
        </section>
      </div>

      <style>{`
        .public-wedding-page {
          background-color: var(--surface-cream);
          min-height: 100vh;
          padding-bottom: 5rem;
        }
        .public-hero {
          position: relative;
          background-image: url('/assets/hero-bg.jpg');
          background-size: cover;
          background-position: center;
          padding: 6rem 1.5rem 5rem 1.5rem;
          text-align: center;
          color: white;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
        }
        .public-hero-backdrop {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(46, 5, 16, 0.85) 0%, rgba(103, 0, 26, 0.75) 50%, rgba(46, 5, 16, 0.95) 100%);
        }
        .public-hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }
        .rings-icon {
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
          filter: drop-shadow(0 0 10px rgba(245, 230, 200, 0.5));
        }
        .hero-eyebrow {
          letter-spacing: 0.3em;
          font-size: 0.85rem;
          color: var(--champagne-300);
          font-weight: 700;
          display: block;
          margin-bottom: 0.6rem;
        }
        .hero-names {
          font-size: 4rem;
          color: #FFF9EE;
          margin-bottom: 0.4rem;
          line-height: 1.1;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
        }
        .hero-date {
          font-size: 1.3rem;
          color: var(--champagne-200);
          margin-bottom: 0.2rem;
          font-weight: 500;
        }
        .hero-venue-tag {
          font-size: 1rem;
          color: var(--champagne-400);
          margin-bottom: 2.2rem;
        }
        .public-countdown-pills {
          display: flex;
          justify-content: center;
          gap: 1.2rem;
          margin-bottom: 2.5rem;
        }
        .pill-item {
          background: rgba(25, 4, 9, 0.75);
          border: 1px solid var(--gold-500);
          padding: 0.8rem 1.4rem;
          border-radius: var(--radius-md);
          min-width: 90px;
        }
        .pill-item strong {
          display: block;
          font-size: 2rem;
          font-family: var(--font-serif);
          color: var(--champagne-100);
          line-height: 1;
        }
        .pill-item span {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--champagne-300);
          text-transform: uppercase;
        }
        .btn-hero-rsvp {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;
          border-radius: var(--radius-pill);
          text-decoration: none;
        }

        .public-content-container {
          max-width: 1080px;
          margin: -2rem auto 0 auto;
          position: relative;
          z-index: 10;
          padding: 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* Historia */
        .our-story-section {
          padding: 2.5rem;
        }
        .story-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        .story-image-wrap {
          position: relative;
        }
        .story-couple-photo {
          width: 100%;
          height: 380px;
          object-fit: cover;
          border-radius: var(--radius-md);
          border: 2px solid var(--border-gold-bright);
          box-shadow: var(--shadow-md);
        }
        .photo-corner-badge {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: var(--bg-burgundy-900);
          color: var(--champagne-200);
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-pill);
          font-size: 0.75rem;
          font-weight: 700;
          border: 1px solid var(--gold-500);
        }
        .section-kicker {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: var(--burgundy-700);
          font-weight: 700;
          display: block;
          margin-bottom: 0.3rem;
        }
        .story-heading {
          font-size: 2.2rem;
          color: var(--bg-burgundy-900);
          margin-bottom: 1.2rem;
        }
        .story-paragraph {
          font-size: 1.35rem;
          color: #4A3A3D;
          line-height: 1.6;
          margin-bottom: 1.8rem;
          font-style: italic;
        }
        .wedding-details-mini {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          border-top: 1px solid var(--border-gold-subtle);
          padding-top: 1.2rem;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .detail-item strong {
          display: block;
          font-size: 0.85rem;
          color: var(--bg-burgundy-900);
        }
        .detail-item span {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        /* RSVP Section */
        .rsvp-section-card {
          padding: 3rem 2.5rem;
        }
        .section-header-center {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 2.2rem auto;
        }
        .section-title {
          font-size: 2.2rem;
          margin: 0.3rem 0;
          color: var(--bg-burgundy-900);
        }
        .section-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .rsvp-form {
          max-width: 780px;
          margin: 0 auto;
        }
        .menu-selector-section {
          margin: 2rem 0;
          border-top: 1px solid var(--border-gold-subtle);
          padding-top: 1.8rem;
        }
        .menu-selector-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
        }
        .menu-selector-header h4 {
          font-size: 1.15rem;
          color: var(--burgundy-700);
        }
        .menu-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 1rem;
        }
        .menu-option-card {
          border: 1px solid var(--border-gold-subtle);
          border-radius: var(--radius-md);
          padding: 1.2rem;
          background: var(--surface-card-subtle);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        .menu-option-card:hover {
          border-color: var(--gold-500);
          background: white;
          transform: translateY(-2px);
        }
        .menu-option-card.selected {
          border: 2px solid var(--burgundy-700);
          background: #FFF9FA;
          box-shadow: 0 4px 15px rgba(103, 0, 26, 0.12);
        }
        .menu-option-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem;
        }
        .menu-badge {
          font-size: 0.7rem;
          font-weight: 700;
          background: var(--champagne-200);
          color: var(--bg-burgundy-950);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }
        .menu-title {
          font-size: 0.95rem;
          color: var(--bg-burgundy-900);
          margin-bottom: 0.4rem;
        }
        .menu-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .form-submit-row {
          text-align: center;
          margin-top: 2rem;
        }
        .btn-lg {
          padding: 0.95rem 3rem;
          font-size: 1.05rem;
        }
        .rsvp-success-banner {
          text-align: center;
          padding: 3rem 1.5rem;
        }
        .rsvp-success-banner h3 {
          font-size: 1.8rem;
          color: var(--burgundy-700);
          margin: 1rem 0 0.5rem 0;
        }
        .sub-note {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        /* Música */
        .music-suggestions-section {
          padding: 2.5rem;
        }
        .music-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .music-icon-wrap {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: var(--champagne-200);
          color: var(--burgundy-700);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .song-inputs-row {
          display: grid;
          grid-template-columns: 2fr 2fr 1.5fr auto;
          gap: 0.8rem;
        }
        .song-inputs-row input {
          padding: 0.7rem 0.9rem;
          border: 1px solid var(--border-gold-subtle);
          border-radius: var(--radius-md);
          font-size: 0.88rem;
        }
        .song-toast-success {
          background: #E8F5E9;
          color: #2E7D32;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-top: 0.8rem;
          font-weight: 600;
        }
        .songs-playlist-preview {
          margin-top: 2rem;
          border-top: 1px solid var(--border-gold-subtle);
          padding-top: 1.5rem;
        }
        .playlist-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--burgundy-700);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 0.8rem;
        }
        .songs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.8rem;
        }
        .song-pill-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0.9rem;
          background: var(--surface-cream);
          border: 1px solid var(--border-gold-subtle);
          border-radius: var(--radius-md);
        }
        .song-title-text {
          font-weight: 600;
          font-size: 0.88rem;
          color: var(--text-primary);
          display: block;
        }
        .song-artist-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .vote-btn {
          background: white;
          border: 1px solid var(--border-gold-subtle);
          color: var(--burgundy-700);
          padding: 0.3rem 0.6rem;
          border-radius: var(--radius-pill);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .vote-btn:hover {
          background: var(--burgundy-100);
          transform: scale(1.05);
        }

        /* Banner Álbum */
        .album-promo-banner {
          padding: 3rem 2rem;
          text-align: center;
        }
        .album-promo-content {
          max-width: 600px;
          margin: 0 auto;
        }
        .album-promo-title {
          font-size: 2.2rem;
          color: var(--champagne-200);
          margin: 0.8rem 0 0.4rem 0;
        }
        .album-promo-sub {
          color: var(--champagne-100);
          font-size: 0.95rem;
          margin-bottom: 1.8rem;
        }

        @media (max-width: 850px) {
          .hero-names { font-size: 2.8rem; }
          .story-grid { grid-template-columns: 1fr; }
          .song-inputs-row { grid-template-columns: 1fr; }
          .wedding-details-mini { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
