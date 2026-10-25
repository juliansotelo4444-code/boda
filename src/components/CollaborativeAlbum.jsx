import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Heart, Maximize2, X, Play, Pause, Sparkles, Check, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const CollaborativeAlbum = () => {
  const { data, addPhoto, deletePhoto, togglePhotoLike } = useWedding();
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const fileInputRef = useRef(null);

  // Manejo de Slideshow / Modo Proyector
  useEffect(() => {
    let timer;
    if (isSlideshowActive && data.photos.length > 0) {
      timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % data.photos.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isSlideshowActive, data.photos.length]);

  // Compresión Client-Side en Canvas para optimizar carga
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compresión en formato WebP con calidad 85%
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.85);
          resolve(compressedDataUrl);
        };
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(20);

    try {
      // Simular progreso de compresión y envío directo
      setUploadProgress(50);
      const compressedUrl = await compressImage(file);
      setUploadProgress(85);

      setTimeout(() => {
        setUploadProgress(100);
        addPhoto({
          url: compressedUrl,
          uploader: uploaderName.trim() || 'Invitado Amigo',
          caption: caption.trim() || '¡Capturando momentos inolvidables de la fiesta!'
        });
        setIsUploading(false);
        setUploadProgress(0);
        setCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 500);
    } catch (err) {
      console.error('Error procesando imagen', err);
      setIsUploading(false);
    }
  };

  return (
    <div className="album-module-container animate-fade-in">
      {/* HEADER DEL ÁLBUM */}
      <div className="module-top-bar">
        <div>
          <span className="module-kicker">RECUERDOS EN VIVO • 8 OCTUBRE 2027</span>
          <h2 className="module-title font-serif">Álbum Colaborativo de la Boda</h2>
          <p className="album-desc">
            Alojado directamente en la plataforma. Los invitados suben fotos instantáneas desde sus móviles sin necesidad de registrarse ni iniciar sesión.
          </p>
        </div>

        <div className="album-actions-right">
          <button 
            className="btn-secondary"
            onClick={() => {
              setIsSlideshowActive(true);
              setCurrentSlideIndex(0);
            }}
          >
            <Play size={16} /> Modo Proyector (Pantalla Completa)
          </button>
        </div>
      </div>

      {/* ÁREA DE SUBIDA RÁPIDA (WIDGET DE CARGA) */}
      <div className="upload-card card-luxury">
        <div className="upload-grid">
          <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
            <div className="dropzone-inner">
              <div className="camera-icon-circle">
                <Camera size={32} />
              </div>
              <h4>Haz clic o arrastra fotos aquí</h4>
              <p>Optimización automática WebP sin pérdida de calidad (Directo a almacenamiento)</p>
              <button type="button" className="btn-primary btn-sm">
                <Upload size={14} /> Seleccionar de tu Dispositivo / Tomar Foto
              </button>
            </div>
          </div>

          <div className="upload-meta-form">
            <h4 className="meta-form-title font-serif">Tu Mensaje de Recuerdos</h4>
            <div className="form-group">
              <label>Tu Nombre o Familia (Opcional):</label>
              <input 
                type="text" 
                placeholder="Ej. Tía Graciela o Los Primos"
                value={uploaderName}
                onChange={e => setUploaderName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Dedicatoria para Julián y Yanet:</label>
              <textarea 
                rows="2"
                placeholder="¡Qué vivan los novios! ¡Qué fiesta increíble!"
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </div>

            {isUploading && (
              <div className="upload-progress-bar-wrap">
                <div className="progress-labels">
                  <span>Comprimiendo y guardando en vivo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FEED EN VIVO DE FOTOS */}
      <div className="photos-feed-section">
        <div className="feed-header">
          <h3 className="font-serif">Galería en Tiempo Real ({data.photos.length} Recuerdos)</h3>
          <span className="live-pill">🔴 En Vivo</span>
        </div>

        {data.photos.length === 0 ? (
          <div className="card-luxury" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
            <Camera size={44} color="var(--gold-500)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
            <h4 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--burgundy-700)', marginBottom: '0.5rem' }}>
              El Álbum está listo para los primeros recuerdos
            </h4>
            <p style={{ maxWidth: '520px', margin: '0 auto', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Utiliza el recuadro superior para subir tus fotos desde el dispositivo. Las imágenes se optimizan en vivo en formato WebP para proyectarse en la fiesta sin necesidad de iniciar sesión.
            </p>
          </div>
        ) : (
          <div className="photos-grid">
            {data.photos.map(photo => (
              <div key={photo.id} className="photo-card card-luxury">
                <div className="photo-img-wrap" onClick={() => setSelectedPhotoModal(photo)}>
                  <img src={photo.url} alt={photo.caption} loading="lazy" />
                  <button className="expand-overlay-btn" title="Ampliar">
                    <Maximize2 size={18} />
                  </button>
                </div>

                <div className="photo-card-body">
                  <div className="photo-author-row">
                    <span className="photo-author">📸 {photo.uploader}</span>
                    <span className="photo-time">{photo.time}</span>
                  </div>
                  <p className="photo-caption">{photo.caption}</p>

                  <div className="photo-footer-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                      className="like-btn"
                      onClick={() => togglePhotoLike(photo.id)}
                    >
                      <Heart size={16} fill="var(--burgundy-700)" color="var(--burgundy-700)" />
                      <span>{photo.likes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Deseas eliminar esta foto de "${photo.uploader}"?`)) {
                          deletePhoto(photo.id);
                        }
                      }}
                      title="Eliminar foto"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '0.3rem',
                        transition: 'color 0.15s ease'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FOTO INDIVIDUAL EN TAMAÑO COMPLETO */}
      {selectedPhotoModal && (
        <div className="lightbox-backdrop" onClick={() => setSelectedPhotoModal(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedPhotoModal(null)}>
              <X size={24} />
            </button>
            <img src={selectedPhotoModal.url} alt="Recuerdo de boda" className="lightbox-img" />
            <div className="lightbox-info">
              <h4>{selectedPhotoModal.uploader}</h4>
              <p>{selectedPhotoModal.caption}</p>
              <button 
                className="like-btn"
                onClick={() => togglePhotoLike(selectedPhotoModal.id)}
              >
                <Heart size={18} fill="var(--burgundy-700)" color="var(--burgundy-700)" />
                <span>{selectedPhotoModal.likes} Me gusta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODO PROYECTOR / SLIDESHOW PANTALLA COMPLETA */}
      {isSlideshowActive && (
        <div className="slideshow-fullscreen">
          <button className="slideshow-exit-btn" onClick={() => setIsSlideshowActive(false)}>
            <X size={26} /> Salir del Modo Proyector
          </button>

          <div className="slideshow-banner-top">
            <span className="slideshow-brand">💍 Julián &amp; Yanet — 8 de Octubre de 2027</span>
            <span className="slideshow-counter">
              Foto {currentSlideIndex + 1} de {data.photos.length}
            </span>
          </div>

          <div className="slideshow-image-container">
            <img 
              src={data.photos[currentSlideIndex].url} 
              alt="Slide"
              className="slideshow-main-img animate-fade-in"
              key={currentSlideIndex}
            />
          </div>

          <div className="slideshow-caption-footer">
            <h3 className="slide-uploader font-serif">{data.photos[currentSlideIndex].uploader}</h3>
            <p className="slide-text">"{data.photos[currentSlideIndex].caption}"</p>
          </div>
        </div>
      )}

      <style>{`
        .album-module-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem 1.5rem;
        }
        .album-desc {
          color: var(--text-secondary);
          margin-top: 0.3rem;
          font-size: 0.95rem;
        }
        .upload-card {
          padding: 1.8rem;
          margin-bottom: 2.5rem;
          background: linear-gradient(135deg, #FFFFFF 0%, #FDF9F3 100%);
        }
        .upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .upload-dropzone {
          border: 2px dashed var(--gold-500);
          border-radius: var(--radius-md);
          background: rgba(245, 230, 200, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
        }
        .upload-dropzone:hover {
          background: rgba(245, 230, 200, 0.4);
          border-color: var(--burgundy-700);
        }
        .camera-icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--burgundy-700);
          color: var(--champagne-200);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
          box-shadow: 0 4px 15px rgba(103, 0, 26, 0.25);
        }
        .dropzone-inner h4 {
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
          color: var(--bg-burgundy-900);
        }
        .dropzone-inner p {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1.2rem;
        }
        .meta-form-title {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--burgundy-700);
        }
        .upload-progress-bar-wrap {
          margin-top: 1rem;
        }
        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--burgundy-700);
          margin-bottom: 0.4rem;
        }
        .progress-track {
          height: 8px;
          background: #E8E2D8;
          border-radius: var(--radius-pill);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold-500) 0%, var(--burgundy-700) 100%);
          transition: width 0.3s ease;
        }

        /* Feed de fotos */
        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .live-pill {
          background: #FFEBEE;
          color: #C62828;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-pill);
          animation: pulseGold 2s infinite;
        }
        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.8rem;
        }
        .photo-card {
          border-radius: var(--radius-md);
          overflow: hidden;
          background: white;
        }
        .photo-img-wrap {
          position: relative;
          height: 250px;
          cursor: pointer;
          overflow: hidden;
        }
        .photo-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .photo-card:hover .photo-img-wrap img {
          transform: scale(1.05);
        }
        .expand-overlay-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .photo-card:hover .expand-overlay-btn {
          opacity: 1;
        }
        .photo-card-body {
          padding: 1.2rem;
        }
        .photo-author-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }
        .photo-author {
          font-weight: 700;
          color: var(--burgundy-700);
        }
        .photo-time {
          color: var(--text-muted);
        }
        .photo-caption {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          min-height: 40px;
        }
        .photo-footer-actions {
          display: flex;
          justify-content: flex-end;
        }
        .like-btn {
          background: var(--burgundy-100);
          color: var(--burgundy-700);
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .like-btn:hover {
          transform: scale(1.08);
        }

        /* Lightbox */
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(30, 5, 12, 0.92);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          padding: 2rem;
        }
        .lightbox-content {
          position: relative;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .lightbox-img {
          max-height: 70vh;
          object-fit: contain;
          background: #111;
        }
        .lightbox-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0,0,0,0.6);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .lightbox-info {
          padding: 1.2rem 1.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Slideshow Fullscreen */
        .slideshow-fullscreen {
          position: fixed;
          inset: 0;
          background: #1A040A;
          z-index: 4000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .slideshow-exit-btn {
          position: absolute;
          top: 20px;
          right: 30px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          z-index: 10;
        }
        .slideshow-banner-top {
          position: absolute;
          top: 25px;
          left: 35px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .slideshow-brand {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--champagne-200);
        }
        .slideshow-counter {
          font-size: 0.9rem;
          color: var(--champagne-400);
        }
        .slideshow-image-container {
          max-width: 85vw;
          max-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slideshow-main-img {
          max-width: 100%;
          max-height: 75vh;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          border: 2px solid var(--gold-500);
        }
        .slideshow-caption-footer {
          position: absolute;
          bottom: 30px;
          text-align: center;
          background: rgba(46, 5, 16, 0.85);
          backdrop-filter: blur(8px);
          padding: 1rem 3rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-gold-bright);
        }
        .slide-uploader {
          font-size: 1.2rem;
          color: var(--champagne-200);
          margin-bottom: 0.2rem;
        }
        .slide-text {
          font-size: 1rem;
          color: var(--champagne-100);
        }

        @media (max-width: 850px) {
          .upload-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
