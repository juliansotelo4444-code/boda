import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

/**
 * Custom Hook para gestionar la Configuración Global de la Boda (Julián & Yanet)
 * - Evita llamadas excesivas a la API mediante cache en memoria y Debounce configurable.
 * - Soporta Optimistic Updates con rollback automático ante errores de red.
 */
export const useWeddingSettings = (debounceMs = 600) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Snapshot para rollback en caso de fallo
  const previousSettingsRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // 1. Lectura con Cache Inicial (Stale-While-Revalidate pattern)
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getSettings();
      setSettings(data);
      previousSettingsRef.current = data;
    } catch (err) {
      setError(err.message || 'Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // 2. Mutación al servidor
  const persistToServer = async (payload) => {
    setIsSaving(true);
    try {
      const updated = await api.updateSettings(payload);
      setSettings(updated);
      previousSettingsRef.current = updated;
      setError(null);
    } catch (err) {
      // Rollback al estado anterior si la red falla
      if (previousSettingsRef.current) {
        setSettings(previousSettingsRef.current);
      }
      setError(err.message || 'Error al guardar los cambios en la nube');
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Actualización Optimista con Debounce para inputs de texto (Nuestra Historia, Luna de Miel)
  const updateSettingDebounced = useCallback((field, value) => {
    // Actualización inmediata en UI (60 FPS)
    setSettings((prev) => {
      const next = { ...prev, [field]: value };
      return next;
    });

    // Cancelar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Disparar persistencia tras período de inactividad
    debounceTimerRef.current = setTimeout(() => {
      persistToServer({ [field]: value });
    }, debounceMs);
  }, [debounceMs]);

  // 4. Actualización Inmediata (para fotos de portada, switches RSVP o guardado manual)
  const updateSettingsImmediate = useCallback(async (fields) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Actualizar UI optimistamente
    setSettings((prev) => ({ ...prev, ...fields }));

    // Guardar inmediatamente
    await persistToServer(fields);
  }, []);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateSettingDebounced,
    updateSettingsImmediate,
    refetch: fetchSettings,
  };
};

export default useWeddingSettings;
