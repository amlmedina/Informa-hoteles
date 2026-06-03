import { collection, doc, setDoc } from "firebase/firestore";
import { db, BASE_PATH } from "../config/firebase";

export const seedHotels = async () => {
  const hotels = [
    {
      id: "hotel-sede-01",
      nombre: "Grand Lux Indipris",
      estrellas: 5,
      distancia: "A 2 min a pie de Abastur",
      basePrice: 3200,
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
      stock_por_dia: {
        "2026-09-20": { disponible: 5, precioSencilla: 3200, precioDoble: 3500 },
        "2026-09-21": { disponible: 8, precioSencilla: 3200, precioDoble: 3500 },
        "2026-09-22": { disponible: 0, precioSencilla: 3200, precioDoble: 3500 } // Agotado para probar
      }
    },
    {
      id: "hotel-boutique-02",
      nombre: "Boutique Reforma Premium",
      estrellas: 4,
      distancia: "A 10 min en transporte oficial",
      basePrice: 2450,
      imageUrl: "https://images.unsplash.com/photo-1551882547-ff43c63efe81?auto=format&fit=crop&q=80&w=1000",
      stock_por_dia: {
        "2026-09-20": { disponible: 15, precioSencilla: 2450, precioDoble: 2800 },
        "2026-09-21": { disponible: 12, precioSencilla: 2450, precioDoble: 2800 }
      }
    }
  ];

  try {
    for (const hotel of hotels) {
      await setDoc(doc(db, `${BASE_PATH}/hoteles`, hotel.id), hotel);
    }
    console.log("¡Hoteles de prueba inyectados con éxito!");
  } catch (e) {
    console.error("Error al inyectar datos:", e);
  }
};
