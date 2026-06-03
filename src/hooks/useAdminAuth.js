import { useState } from 'react';

export const useAdminAuth = () => {
  // MODO DESARROLLO: Inicializamos como TRUE para saltar cualquier restricción.
  const [isAdmin, setIsAdmin] = useState(true);

  // Mantenemos la estructura de la función por si algún botón de "Entrar" 
  // todavía está programado para llamarla, así no provocará un error de React.
  const login = () => {
    setIsAdmin(true);
    return true;
  };

  // Mantenemos el logout de forma cosmética
  const logout = () => {
    console.warn("Logout deshabilitado temporalmente en Modo Desarrollo");
  };

  return { isAdmin, login, logout };
};
