import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import Badge from '../../../components/Badge';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

function CompletedRequirementItem({ req, index, onRemove, onToggle }) {
  const isTouch = useIsTouchDevice();
  const { getEstado, getPrioridad, getTipo } = useEstadosPrioridades();

  return (
    <li className="flex items-center gap-[0.6em] bg-primero/20 border border-cuarto/10 rounded-[0.6em] px-[0.85em] py-[0.7em] group/req opacity-60">
      <button
        onClick={() => onToggle(req.id, false)}
        aria-label="Marcar como pendiente"
        className="w-[1.4em] h-[1.4em] rounded-full border-2 border-segundo bg-segundo/20 flex items-center justify-center flex-shrink-0 hover:bg-segundo/40 transition-all duration-200 focus:outline-none"
      >
        <FontAwesomeIcon icon={faCheck} className="text-segundo text-[0.6em]" />
      </button>
      <span className="text-[0.8em] text-segundo/40 font-poppins font-semibold w-[1.5em] flex-shrink-0 tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="flex-1 text-[0.9em] text-cuarto/40 font-roboto truncate line-through min-w-0">
        {req.texto}
      </span>
      <Badge config={getEstado(req.estado)} size="sm" />
      <Badge config={getPrioridad(req.prioridad)} size="sm" />
      <Badge config={getTipo(req.tipo)} size="sm" />
      <button
        onClick={() => onRemove(req.id)}
        aria-label="Eliminar"
        className={`${isTouch ? 'opacity-100' : 'opacity-0 group-hover/req:opacity-100'} w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] text-quinto/30 hover:text-quinto-claro transition-all duration-200 focus:outline-none flex-shrink-0`}
      >
        <FontAwesomeIcon icon={faTrash} className="text-[0.8em]" />
      </button>
    </li>
  );
}

export default CompletedRequirementItem;
