import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

const appId = "indipris-eventos-v1";

export default function useEventConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const ref = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "config",
      "event"
    );

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setConfig(snap.data());
      }
    });

    return () => unsub();
  }, []);

  return config;
}
