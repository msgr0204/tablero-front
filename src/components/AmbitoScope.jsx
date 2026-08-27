import { useState, useEffect } from 'react';
import { useAmbito } from '../context/AmbitoContext';
import tableroPersonalService from '../modules/tablero/services/tableroPersonalService';

// El tablero personal solo necesita inicializarse (clonar catálogos) una vez por
// carga de la app. Guardar la promesa fuera de React evita que StrictMode (doble
// montaje en dev) o remontajes por key disparen la clonación varias veces en
// paralelo. El índice único del backend es la red final, pero esto evita el ruido.
let inicializacionPersonal = null;

// Fija el ámbito activo al entrar a una ruta y sincroniza el header antes de
// dejar renderizar las páginas (que hacen fetch al montar). Para el ámbito
// personal, además asegura que el catálogo personal exista (clonado de la
// empresa la primera vez) antes de mostrar el tablero.
function AmbitoScope({ ambito, inicializar = false, children }) {
  const { ambito: actual, setAmbito } = useAmbito();
  const [listo, setListo] = useState(!inicializar && actual === ambito);

  useEffect(() => {
    let vigente = true;
    if (actual !== ambito) {
      setAmbito(ambito);
    }
    if (!inicializar) {
      setListo(true);
      return;
    }
    // El ámbito ya quedó en localStorage vía setAmbito (síncrono), así que la
    // llamada de inicialización viaja con el header correcto. Se reutiliza la
    // misma promesa si ya se disparó, para no clonar en paralelo.
    if (!inicializacionPersonal) {
      inicializacionPersonal = tableroPersonalService.inicializar()
        .catch(() => { /* si ya existe o falla, el tablero igual carga */ });
    }
    inicializacionPersonal.finally(() => { if (vigente) setListo(true); });
    return () => { vigente = false; };
  }, [ambito, actual, inicializar, setAmbito]);

  if (!listo) {
    return (
      <div className="min-h-dvh bg-primero flex items-center justify-center">
        <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}

export default AmbitoScope;
