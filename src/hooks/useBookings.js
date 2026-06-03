import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../config/firebase'; // Asegúrate de tu ruta de config

export const useBookings = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apuntamos a la colección de reservas dentro de tu ecosistema
    const reservasRef = collection(db, "artifacts/indipris-eventos-v1/public/data/reservas");
    const q = query(reservasRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Ordenamos localmente de la más reciente a la más antigua
        data.sort((a, b) => new Date(b.fechaReserva || 0) - new Date(a.fechaReserva || 0));
        
        setReservas(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al procesar reservas:", err);
        setLoading(false);
      }
    }, (error) => {
      console.error("Error de conexión con reservas:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { reservas, loading };
};