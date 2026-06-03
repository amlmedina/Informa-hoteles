// src/hooks/useHotels.js
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../config/firebase';

const appId = "indipris-eventos-v1";
const BASE_PATH = `artifacts/${appId}/public/data/hoteles`;

/**
 * Hook para obtener la lista de hoteles en tiempo real.
 * Incluye protecciones para evitar errores de 'undefined' en el frontend.
 */
export const useHotels = () => {
  // Inicializamos siempre como array vacío para evitar errores de .map()
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Referencia a la colección siguiendo la arquitectura estricta
    const hotelsRef = collection(db, BASE_PATH);
    const q = query(hotelsRef);

    // Suscripción en tiempo real con onSnapshot
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        try {
          const hotelList = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // --- SANEAMIENTO DE DATOS (Data Sanitization) ---
            // Si el documento en Firebase no tiene estos campos, 
            // los inicializamos aquí para no romper el HotelCard.jsx
            return {
              id: doc.id,
              nombre: data.nombre || 'Hotel sin nombre',
              imagen: data.imagen || 'https://via.placeholder.com/400x300?text=No+Image',
              ventasPausadas: data.ventasPausadas ?? false, // Protección para la pausa reversible
              stock_por_dia: data.stock_por_dia || {},      // Protección para el mapa de stock
              ...data
            };
          });

          setHotels(hotelList);
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error("Error procesando datos de hoteles:", err);
          setError(err);
          setLoading(false);
        }
      }, 
      (err) => {
        console.error("Error en onSnapshot de hoteles:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup: Cancelar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return { hotels, loading, error };
};

// Exportamos como default para máxima compatibilidad
export default useHotels;