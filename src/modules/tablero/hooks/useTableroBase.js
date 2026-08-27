import { useAmbito } from '../../../context/AmbitoContext';

// Prefijo de ruta según el ámbito activo. Las páginas del tablero se reusan en
// empresa y personal; navegar entre ellas debe respetar el ámbito para no saltar
// de un tablero al otro. Uso: `${base}/${categoriaId}/modulos`.
function useTableroBase() {
  const { esPersonal } = useAmbito();
  return esPersonal ? '/tablero-personal' : '/tablero';
}

export default useTableroBase;
