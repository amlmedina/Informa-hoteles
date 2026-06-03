import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, BASE_PATH } from '../config/firebase';

export const useEventManager = () => {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escuchar cambios en tiempo real del evento maestro
  useEffect(() => {
    const docRef = doc(db, `${BASE_PATH}/configuracion`, 'evento_actual');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setEvento(docSnap.data());
      } else {
        // Valores por defecto si no existe en la DB aún
        setEvento({
          nombre: 'Evento Nuevo',
          fechaInicio: '2026-09-01',
          fechaFin: '2026-09-05',
          direccion: '',
          lat: 19.4326,
          lng: -99.1332,
          logoUrl: ''
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para guardar o actualizar
  const updateEvento = async (data) => {
    try {
      const docRef = doc(db, `${BASE_PATH}/configuracion`, 'evento_actual');
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (e) {
      console.error("Error al actualizar evento:", e);
      return { success: false, error: e };
    }
  };

  return { evento, updateEvento, loading };
};