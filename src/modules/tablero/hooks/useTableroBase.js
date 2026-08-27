import { useAmbito } from '../../../context/AmbitoContext';

// Prefijo de ruta según el tablero activo. Las páginas del tablero se reusan en
// empresa, personal propio y personal compartido; navegar entre ellas debe
// respetar el tablero para no saltar de uno a otro.
//   - empresa           -> /tablero
//   - personal propio   -> /tablero-personal
//   - personal de otro  -> /tablero-personal/de/:ownerId
function useTableroBase() {
  const { esPersonal, ownerId } = useAmbito();
  if (!esPersonal) return '/tablero';
  if (ownerId) return `/tablero-personal/de/${ownerId}`;
  return '/tablero-personal';
}

export default useTableroBase;
