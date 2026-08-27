import { createContext, useContext, useState, useCallback } from 'react';

const AmbitoContext = createContext(null);

const AMBITOS = ['empresa', 'personal'];

// El ámbito activo (empresa vs tablero personal) se guarda en localStorage para
// que el interceptor de apiClient —que vive fuera de React— lea el mismo valor
// y lo mande como header X-Ambito en cada request. Aquí solo se orquesta el
// estado en memoria + su persistencia; el filtrado real ocurre en el backend.
function leerAmbitoInicial() {
  try {
    return localStorage.getItem('ambito') === 'personal' ? 'personal' : 'empresa';
  } catch {
    return 'empresa';
  }
}

function AmbitoProvider({ children }) {
  const [ambito, setAmbitoState] = useState(leerAmbitoInicial);

  const setAmbito = useCallback((nuevo) => {
    const valor = AMBITOS.includes(nuevo) ? nuevo : 'empresa';
    try { localStorage.setItem('ambito', valor); } catch { /* almacenamiento no disponible */ }
    setAmbitoState(valor);
  }, []);

  return (
    <AmbitoContext.Provider value={{ ambito, setAmbito, esPersonal: ambito === 'personal' }}>
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
