import { db } from "../config/firebase";
import { doc, runTransaction, collection, Timestamp } from "firebase/firestore";
import { getDatesInRange } from "../utils/dateUtils";

const appId = "indipris-eventos-v1";
const BASE_PATH = `artifacts/${appId}/public/data`;

const generarCodigo = () => "IND-" + Math.random().toString(36).substring(2, 8).toUpperCase();

export const reservarRango = async (hotelId, fechaEntrada, fechaSalida, habitaciones, tipoHabitacion, clienteData) => {
  const hotelRef = doc(db, `${BASE_PATH}/hoteles`, hotelId);
  const reservasRef = collection(db, `${BASE_PATH}/reservas`);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const hotelDoc = await transaction.get(hotelRef);
      if (!hotelDoc.exists()) throw new Error("Hotel no encontrado");

      const hotelData = hotelDoc.data();
      
      // VALIDACIÓN DE PAUSA
      if (hotelData.ventasPausadas) {
        throw new Error("Las reservaciones para este hotel están temporalmente pausadas.");
      }

      const stockOriginal = hotelData.stock_por_dia || {};
      const newStock = JSON.parse(JSON.stringify(stockOriginal));
      const daysToBook = getDatesInRange(fechaEntrada, fechaSalida);

      let total = 0;
      for (const ymd of daysToBook) {
        if (!newStock[ymd] || newStock[ymd].disponible < habitaciones) {
          throw new Error(`Sin disponibilidad para el día ${ymd}`);
        }

        const precio = tipoHabitacion === "doble" 
          ? (newStock[ymd].precioDoble || 0) 
          : (newStock[ymd].precioSencilla || 0);

        total += precio * habitaciones;
        newStock[ymd].disponible -= habitaciones;
      }

      const codigo = generarCodigo();
      const nuevaReservaRef = doc(reservasRef);

      transaction.set(nuevaReservaRef, {
        confirmacion: codigo,
        hotelId,
        fechaEntrada,
        fechaSalida,
        noches: daysToBook.length,
        habitaciones,
        tipoHabitacion,
        total,
        cliente: clienteData,
        status: "confirmada",
        timestamp: Timestamp.now()
      });

      transaction.update(hotelRef, { stock_por_dia: newStock });
      return codigo;
    });

    return { success: true, codigo: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};