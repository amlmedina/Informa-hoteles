import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBxDE9NuiFoXD_fOooTRpgd_OzPOhGiw3Q",
  authDomain: "informa-indipris.firebaseapp.com",
  projectId: "informa-indipris",
  storageBucket: "informa-indipris.firebasestorage.app",
  messagingSenderId: "754598478959",
  appId: "1:754598478959:web:0d376ae263e5474a6d399a"
};

// Inicialización
const app = initializeApp(firebaseConfig);

// Instancias exportables
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Path base según arquitectura de negocio
export const BASE_PATH = "artifacts/indipris-eventos-v1/public/data";

