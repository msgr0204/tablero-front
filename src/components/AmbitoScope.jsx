import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAmbito } from '../context/AmbitoContext';
import tableroPersonalService from '../modules/tablero/services/tableroPersonalService';
import { TableroPantallaSkeleton } from '../modules/tablero/components/TableroSkeletons';

// La clonación del catálogo personal solo corre una vez por carga de la app.
// Guardar la promesa fuera de React evita que StrictMode o remontajes por key
// disparen la clonación en paralelo. El índice único del backend es la red final.
let inicializacionPropia = null;

// Fija el ámbito y el tablero activo (owner) ANTES de renderizar las páginas
// (que hacen fetch al montar). El owner es la fuente de verdad de "qué tablero
// veo" y viene de la URL:
//   - /tablero-personal            -> mi tablero (ownerParam undefined)
//   - /equipos/:owner              -> tablero de equipo (compartido) de ese owner
// Así el tablero activo sobrevive a recargas y no puede ser pisado por un
// efecto (que era el bug: el scope reseteaba el owner que el selector fijaba).
function AmbitoScope({ ambito, children }) {
  const { ownerId: ownerParam } = useParams();
  const { ambito: actual, setAmbito, ownerId, setOwnerId } = useAmbito();

  const esPersonalPropio = ambito === 'personal' && !ownerParam;
  const ownerObjetivo = ambito === 'personal' ? (ownerParam ?? null) : null;
  const [listo, setListo] = useState(actual === ambito && ownerId === ownerObjetivo && !esPersonalPropio);

  useEffect(() => {
    let vigente = true;
    if (actual !== ambito) setAmbito(ambito);
    if (ownerId !== ownerObjetivo) setOwnerId(ownerObjetivo);

    // Solo se clona el catálogo del tablero PROPIO (no el de un tablero ajeno,
    // que ya tiene los suyos). El header ya quedó sincronizado por setOwnerId.
    if (!esPersonalPropio) {
      setListo(true);
      return;
    }
    if (!inicializacionPropia) {
      inicializacionPropia = tableroPersonalService.inicializar()
        .catch(() => { /* si ya existe o falla, el tablero igual carga */ });
    }
    inicializacionPropia.finally(() => { if (vigente) setListo(true); });
    return () => { vigente = false; };
  }, [ambito, actual, ownerObjetivo, ownerId, esPersonalPropio, setAmbito, setOwnerId]);

  if (!listo) return <TableroPantallaSkeleton />;

  return children;
}

export default AmbitoScope;
