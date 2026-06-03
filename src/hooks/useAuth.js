import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        // Si no hay usuario, lo logueamos de forma anónima
        signInAnonymously(auth);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};