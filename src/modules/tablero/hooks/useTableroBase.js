import { useAmbito } from '../../../context/AmbitoContext';

// Prefijo de ruta según el tablero activo. Las páginas del tablero se reusan en
// empresa, personal propio y personal compartido; navegar entre ellas debe
// respetar el tablero para no saltar de uno a otro.
//   - empresa           -> /tablero
//   - personal propio   -> /tablero-personal
//   - tablero de equipo -> /equipos/:ownerId
function useTableroBase() {
  const { esPersonal, ownerId } = useAmbito();
  if (!esPersonal) return '/tablero';
  if (ownerId) return `/equipos/${ownerId}`;
  return '/tablero-personal';
}

export default useTableroBase;
