import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const appId = "indipris-eventos-v1";

export const useReservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const ref = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "reservas"
    );

    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservas(data);
    });

    return () => unsub();
  }, []);

  return reservas;
};
