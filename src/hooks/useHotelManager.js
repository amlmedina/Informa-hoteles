import { useState } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
// IMPORTANTE: Asegúrate de tener esta función en tus utils, o usa la versión local que te pongo aquí abajo.
// import { getLocalYMD } from '../utils/dateUtils'; 

const appId = "indipris-eventos-v1";
const BASE_PATH = `artifacts/${appId}/public/data/hoteles`;

// Función auxiliar para fechas locales (si no tienes getLocalYMD en utils)
const formatearFechaLocal = (fecha) => {
  const offset = fecha.getTimezoneOffset() * 60000;
  const localDate = new Date(fecha.getTime() - offset);
  return localDate.toISOString().split('T')[0];
};

export const useHotelManager = () => {
  const [processing, setProcessing] = useState(false);

  // ACTUALIZAR UN SOLO DÍA (INDIVIDUAL)
  const updateDay = async (hotelId, dateStr, data) => {
    setProcessing(true);
    try {
      const docRef = doc(db, BASE_PATH, hotelId);
      await setDoc(docRef, {
        stock_por_dia: {
          [dateStr]: {
            ...data,
            updatedAt: new Date().toISOString()
          }
        }
      }, { merge: true });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    } finally {
      setProcessing(false);
    }
  };

  // GENERAR BLOQUE (MASIVO)
  const generateInventoryBlock = async (hotelId, config) => {
    setProcessing(true);
    try {
      // Usar T12:00:00 evita que el cambio de horario de verano desplace el día
      const start = new Date(config.fechaInicio + 'T12:00:00');
      const end = new Date(config.fechaFin + 'T12:00:00');
      
      const stockUpdates = {};

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatearFechaLocal(d);
        
        stockUpdates[dateStr] = {
          disponible: Number(config.disponible),
          precioSencilla: Number(config.precioSencilla),
          precioDoble: Number(config.precioDoble),
          fecha: dateStr // Opcional, pero útil
        };
      }

      // Guardamos TODO el bloque en una sola operación de escritura al mapa
      const hotelRef = doc(db, BASE_PATH, hotelId);
      await setDoc(hotelRef, {
        stock_por_dia: stockUpdates,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return { success: true };
    } catch (e) {
      console.error("Error al generar bloque:", e);
      return { success: false, error: e.message };
    } finally {
      setProcessing(false);
    }
  };

  return { updateDay, generateInventoryBlock, processing };
};
