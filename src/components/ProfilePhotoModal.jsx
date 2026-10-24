import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, X, Check, Link, Sparkles } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const ProfilePhotoModal = ({ isOpen, onClose, initialTab = 'avatar' }) => {
  const { data, updateCouple } = useWedding();
  const [activeTab, setActiveTab] = useState(initialTab); // 'avatar' | 'hero'

  const [avatarPreview, setAvatarPreview] = useState(data.couple?.avatarUrl || '/assets/couple.jpg');
  const [heroPreview, setHeroPreview] = useState(data.couple?.heroImageUrl || '/assets/hero-bg.jpg');
  const [urlInput, setUrlInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const samplePhotos = [
    { label: 'Julián & Yanet (Principal)', url: '/assets/couple.jpg' },
    { label: 'Palacio & Jardines (Paisaje)', url: '/assets/hero-bg.jpg' },
    { label: 'Brindis de Novios', url: '/assets/toast.jpg' },
    { label: 'Alianzas de Matrimonio', url: '/assets/rings.jpg' },
    { label: 'Retrato Romántico', url: '/assets/hero.png' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (activeTab === 'avatar') {
        setAvatarPreview(result);
      } else {
        setHeroPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (activeTab === 'avatar') {
      setAvatarPreview(urlInput.trim());
    } else {
      setHeroPreview(urlInput.trim());
    }
    setUrlInput('');
  };

  const handleSave = () => {
    updateCouple({
      avatarUrl: avatarPreview,
      heroImageUrl: heroPreview,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999 }}>
      <div className="modal-luxury card-luxury" style={{ maxWidth: '580px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Cabecera del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-gold-subtle)', paddingBottom: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-600)', letterSpacing: '1px' }}>
              PERSONALIZAR IDENTIDAD VISUAL
            </span>
            <h3 className="font-serif" style={{ color: 'var(--burgundy-800)', fontSize: '1.4rem', margin: '0.2rem 0 0 0' }}>
              Fotos de Julián &amp; Yanet
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Pestañas de Selección */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#F8F4F0', padding: '0.35rem', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('avatar')}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              background: activeTab === 'avatar' ? 'var(--burgundy-700)' : 'transparent',
              color: activeTab === 'avatar' ? '#FFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            👤 Foto de Perfil (Avatar)
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              background: activeTab === 'hero' ? 'var(--burgundy-700)' : 'transparent',
              color: activeTab === 'hero' ? '#FFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            🌄 Foto de Portada (Banner Principal)
          </button>
        </div>

        {/* Vista Previa Actual */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', background: '#FAF7F5', padding: '1.25rem', borderRadius: '12px', border: '1px dashed var(--gold-400)' }}>
          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 600 }}>
            VISTA PREVIA SELECCIONADA ({activeTab === 'avatar' ? 'PERFIL' : 'PORTADA'})
          </span>

          {activeTab === 'avatar' ? (
            <div style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--gold-500)', boxShadow: '0 8px 20px rgba(103, 0, 26, 0.15)' }}>
              <img src={avatarPreview} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ width: '100%', height: '150px', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--gold-500)' }}>
              <img src={heroPreview} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        {/* Opciones de Carga */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Opción 1: Subir Archivo Local */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.75rem', width: '100%' }}
          >
            <Upload size={18} color="var(--burgundy-700)" /> Subir Foto desde tu Computadora / Móvil
          </button>

          {/* Opción 2: Pegar URL */}
          <form onSubmit={handleApplyUrl} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="url"
              className="input-luxury"
              placeholder="O pega aquí la URL de la imagen (https://...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              style={{ flex: 1, fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Aplicar URL
            </button>
          </form>

          {/* Opción 3: Fotos recomendadas del Álbum */}
          <div>
            <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              O elige de las fotos del álbum:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {samplePhotos.map((photo, i) => (
                <div
                  key={i}
                  title={photo.label}
                  onClick={() => {
                    if (activeTab === 'avatar') setAvatarPreview(photo.url);
                    else setHeroPreview(photo.url);
                  }}
                  style={{
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: (activeTab === 'avatar' ? avatarPreview : heroPreview) === photo.url ? '2px solid var(--burgundy-700)' : '1px solid #DDD',
                    opacity: (activeTab === 'avatar' ? avatarPreview : heroPreview) === photo.url ? 1 : 0.75,
                    transform: (activeTab === 'avatar' ? avatarPreview : heroPreview) === photo.url ? 'scale(1.05)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <img src={photo.url} alt={photo.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-gold-subtle)', paddingTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '150px', justifyContent: 'center' }}
          >
            {saveSuccess ? (
              <>
                <Check size={18} /> ¡Guardado!
              </>
            ) : (
              <>
                <Camera size={18} /> Guardar Fotos
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoModal;
