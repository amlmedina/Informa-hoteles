import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, BASE_PATH } from '../config/firebase';

export const useHotelEditor = () => {
  const [updating, setUpdating] = useState(false);

  const updateDayStock = async (hotelId, dateStr, newData) => {
    setUpdating(true);
    try {
      const hotelRef = doc(db, `${BASE_PATH}/hoteles`, hotelId);
      
      // Usamos setDoc con merge para que si 'stock_por_dia' no existe, lo cree.
      // Si ya existe, solo actualiza o añade la fecha específica.
      await setDoc(hotelRef, {
        stock_por_dia: {
          [dateStr]: {
            disponible: Number(newData.disponible),
            precioSencilla: Number(newData.precioSencilla),
            precioDoble: Number(newData.precioDoble)
          }
        }
      }, { merge: true });

      return { success: true };
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      return { success: false, error };
    } finally {
      setUpdating(false);
    }
  };

  return { updateDayStock, updating };
};