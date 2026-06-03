import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db, BASE_PATH } from "../config/firebase";
import { getDateRangeArray } from "../utils/dateUtils";

export const adminService = {
  /**
   * Sobreescribe masivamente el stock de un hotel para un rango de fechas.
   */
  updateMasterStock: async (hotelId, config) => {
    const { startDate, endDate, stock, precioSencilla, precioDoble } = config;
    const hotelRef = doc(db, `${BASE_PATH}/hoteles`, hotelId);
    
    const range = getDateRangeArray(startDate, endDate);
    const newStockMap = {};

    range.forEach(dateStr => {
      newStockMap[dateStr] = {
        disponible: Number(stock),
        precioSencilla: Number(precioSencilla),
        precioDoble: Number(precioDoble)
      };
    });

    try {
      // Usamos merge: true para no borrar otros campos del hotel (nombre, fotos, etc)
      await updateDoc(hotelRef, {
        stock_por_dia: newStockMap
      });
      return { success: true };
    } catch (error) {
      console.error("Error actualizando Master Stock:", error);
      throw error;
    }
  }
};