import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialWeddingData } from '../data/initialData';
import { api } from '../services/api';

const WeddingContext = createContext(null);

export const WeddingProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    // Limpiar claves antiguas de pruebas si existieran
    localStorage.removeItem('nuestro_gran_dia_data');
    const saved = localStorage.getItem('nuestro_gran_dia_data_clean');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error cargando datos de localStorage', e);
      }
    }
    return initialWeddingData;
  });

  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Sincronizar con Neon Backend al montar
  useEffect(() => {
    let isMounted = true;
    api.getPublicWeddingInfo()
      .then((info) => {
        if (!isMounted || !info) return;
        setIsCloudConnected(true);
        if (info.settings) {
          setData((prev) => ({
            ...prev,
            couple: {
              ...prev.couple,
              groom: info.settings.groomName || prev.couple.groom,
              bride: info.settings.brideName || prev.couple.bride,
              date: info.settings.weddingDate || prev.couple.date,
              venue: info.settings.venueName || prev.couple.venue,
              address: info.settings.venueAddress || prev.couple.address,
              totalBudget: Number(info.settings.totalBudget) || prev.couple.totalBudget,
              currency: info.settings.currency || prev.couple.currency,
            },
            timeline: info.timeline || prev.timeline || [],
            storyMilestones: info.story || prev.storyMilestones || [],
          }));
        }
      })
      .catch((err) => {
        console.info('Backend Neon local no disponible aún, usando almacenamiento local:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Guardar en localStorage ante cambios
  useEffect(() => {
    localStorage.setItem('nuestro_gran_dia_data_clean', JSON.stringify(data));
  }, [data]);

  const resetToZero = () => {
    localStorage.removeItem('nuestro_gran_dia_data_clean');
    localStorage.removeItem('nuestro_gran_dia_data');
    setData(initialWeddingData);
  };

  // Gestor de Invitados
  const addGuest = (guest) => {
    const newGuest = {
      ...guest,
      id: `g_${Date.now()}`,
      status: guest.status || 'Pendiente'
    };
    setData(prev => ({ ...prev, guests: [newGuest, ...prev.guests] }));
  };

  const updateGuest = (id, updates) => {
    setData(prev => ({
      ...prev,
      guests: prev.guests.map(g => g.id === id ? { ...g, ...updates } : g)
    }));
  };

  const deleteGuest = (id) => {
    setData(prev => ({
      ...prev,
      guests: prev.guests.filter(g => g.id !== id)
    }));
  };

  const assignGuestToTable = (guestId, tableId) => {
    updateGuest(guestId, { tableId });
  };

  // Gestor de Mesas
  const updateTablePosition = (tableId, x, y) => {
    setData(prev => ({
      ...prev,
      tables: prev.tables.map(t => t.id === tableId ? { ...t, x, y } : t)
    }));
  };

  const addTable = (table) => {
    const newTable = {
      ...table,
      id: `t_${Date.now()}`,
      x: table.x || 300,
      y: table.y || 200,
      shape: table.shape || 'round',
      capacity: table.capacity || 10,
      color: '#9B1D3D'
    };
    setData(prev => ({ ...prev, tables: [...prev.tables, newTable] }));
  };

  // Gestor de Tareas
  const toggleTask = (id) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: `tk_${Date.now()}`,
      completed: false
    };
    setData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  // Gestor de Finanzas & Pagos
  const addBudgetItem = (item) => {
    const newItem = {
      ...item,
      id: `b_${Date.now()}`,
      paid: 0,
      payments: []
    };
    setData(prev => ({ ...prev, budgetItems: [...prev.budgetItems, newItem] }));
  };

  const addPayment = (budgetItemId, payment) => {
    setData(prev => ({
      ...prev,
      budgetItems: prev.budgetItems.map(item => {
        if (item.id === budgetItemId) {
          const newPayments = [...item.payments, { ...payment, id: `p_${Date.now()}` }];
          const totalPaid = newPayments.reduce((acc, curr) => acc + Number(curr.amount), 0);
          return {
            ...item,
            paid: totalPaid,
            payments: newPayments
          };
        }
        return item;
      })
    }));
  };

  // Álbum Colaborativo (Subida instantánea de fotos)
  const addPhoto = (photoData) => {
    const newPhoto = {
      id: `ph_${Date.now()}`,
      url: photoData.url,
      uploader: photoData.uploader || 'Invitado Especial',
      caption: photoData.caption || 'Celebrando con Julián y Yanet ✨',
      likes: 1,
      time: 'Hace un instante'
    };
    setData(prev => ({ ...prev, photos: [newPhoto, ...prev.photos] }));
  };

  const togglePhotoLike = (photoId) => {
    setData(prev => ({
      ...prev,
      photos: prev.photos.map(ph => ph.id === photoId ? { ...ph, likes: ph.likes + 1 } : ph)
    }));
  };

  // Canciones
  const addSong = (song) => {
    const newSong = {
      id: `s_${Date.now()}`,
      title: song.title,
      artist: song.artist,
      requestedBy: song.requestedBy || 'Invitado',
      votes: 1
    };
    setData(prev => ({ ...prev, songs: [...prev.songs, newSong] }));
  };

  const voteSong = (id) => {
    setData(prev => ({
      ...prev,
      songs: prev.songs.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s)
    }));
  };

  // Luna de Miel
  const addHoneymoonItem = (item) => {
    const newItem = {
      ...item,
      id: `h_${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      honeymoon: {
        ...prev.honeymoon,
        items: [...prev.honeymoon.items, newItem]
      }
    }));
  };

  // Notificaciones del Navegador / Web Push
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification('🔔 ¡Notificaciones activadas para Julián & Yanet!', {
          body: 'Recibirás recordatorios puntuales de pagos de proveedores y fechas importantes.',
          icon: '/assets/couple.jpg'
        });
      }
      return perm;
    }
    return 'unsupported';
  };

  const sendTestNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/assets/couple.jpg'
      });
    } else {
      alert(`[Notificación Push Simulada]\n${title}\n${body}`);
    }
  };

  return (
    <WeddingContext.Provider value={{
      data,
      addGuest,
      updateGuest,
      deleteGuest,
      assignGuestToTable,
      updateTablePosition,
      addTable,
      toggleTask,
      addTask,
      addBudgetItem,
      addPayment,
      addPhoto,
      togglePhotoLike,
      addSong,
      voteSong,
      addHoneymoonItem,
      notificationPermission,
      requestNotificationPermission,
      sendTestNotification,
      isCloudConnected,
      resetToZero
    }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => useContext(WeddingContext);
