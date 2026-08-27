import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const AmbitoContext = createContext(null);

const AMBITOS = ['empresa', 'personal'];

// Estado de navegación por ámbito. Persiste en localStorage para que el
// interceptor de apiClient —fuera de React— mande X-Ambito y X-Owner-Id
// coherentes en cada request. El filtrado y los permisos reales viven en el
// backend; aquí solo se orquesta qué se está viendo.
function leer(clave, porDefecto) {
  try {
    return localStorage.getItem(clave) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

function AmbitoProvider({ children }) {
  const [ambito, setAmbitoState] = useState(() => (leer('ambito', 'empresa') === 'personal' ? 'personal' : 'empresa'));
  const [ownerId, setOwnerIdState] = useState(() => leer('owner_id', null));
  const { usuario } = useAuth();

  const setAmbito = useCallback((nuevo) => {
    const valor = AMBITOS.includes(nuevo) ? nuevo : 'empresa';
    try { localStorage.setItem('ambito', valor); } catch { /* almacenamiento no disponible */ }
    setAmbitoState(valor);
  }, []);

  // ownerId null (o el propio) = mi tablero; otro id = tablero que me compartieron.
  const setOwnerId = useCallback((id) => {
    try {
      if (id) localStorage.setItem('owner_id', id);
      else localStorage.removeItem('owner_id');
    } catch { /* almacenamiento no disponible */ }
    setOwnerIdState(id ?? null);
  }, []);

  const esPersonal = ambito === 'personal';
  // Soy dueño del tablero personal activo si no hay owner externo, o si coincide
  // con mi propio usuario.
  const esDueno = esPersonal && (!ownerId || ownerId === usuario?.id);

  return (
    <AmbitoContext.Provider value={{ ambito, setAmbito, esPersonal, ownerId, setOwnerId, esDueno }}>
      {children}
    </AmbitoContext.Provider>
  );
}

function useAmbito() {
  const ctx = useContext(AmbitoContext);
  if (!ctx) throw new Error('useAmbito debe usarse dentro de AmbitoProvider');
  return ctx;
}

export { AmbitoProvider, useAmbito };
