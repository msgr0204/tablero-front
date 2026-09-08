import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import Badge from '../../../components/Badge';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import usePermisosTablero from '../hooks/usePermisosTablero';
import { formatearFecha } from '../../../lib/formatFecha';

function CompletedRequirementItem({ req, index, onRemove, onToggle, selected, onSelect }) {
  const isTouch = useIsTouchDevice();
  const { getEstado, getPrioridad, getTipo } = useEstadosPrioridades();
  const { puedeEliminarItem, puedeReabrir } = usePermisosTablero();
  const puedeEditar = puedeEliminarItem(req);

  return (
    <li className={`flex items-center gap-[0.6em] border rounded-[0.6em] px-[0.85em] py-[0.7em] group/req transition-colors duration-200 ${selected ? 'bg-segundo/10 border-segundo/40' : 'bg-primero/20 border-cuarto/10 opacity-60'}`}>
      <button
        onClick={() => puedeReabrir && onToggle(req.id, false)}
        disabled={!puedeReabrir}
        aria-label="Marcar como pendiente"
        title={puedeReabrir ? undefined : 'Solo un administrador puede reabrir un requerimiento entregado'}
        className={[
          'w-[1.4em] h-[1.4em] rounded-full border-2 border-segundo bg-segundo/20 flex items-center justify-center flex-shrink-0 transition-all duration-200 focus:outline-none',
          puedeReabrir ? 'hover:bg-segundo/40' : 'opacity-40 cursor-not-allowed',
        ].join(' ')}
      >
        <FontAwesomeIcon icon={faCheck} className="text-segundo text-[0.6em]" />
      </button>
      <span className="text-[0.8em] text-segundo/40 font-poppins font-semibold w-[1.5em] flex-shrink-0 tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </span>
      <button
        type="button"
        onClick={() => onSelect(req.id)}
        className="flex-1 text-[0.9em] text-cuarto/40 font-roboto truncate line-through min-w-0 text-left cursor-pointer"
      >
        {req.texto}
      </button>
      {/* Fecha real en que se completó, no la planeada: en un requerimiento ya
          entregado el dato que importa es cuándo se cerró. */}
      {req.completado_at && (
        <span className="hidden sm:inline text-[0.7em] text-segundo/50 font-roboto whitespace-nowrap flex-shrink-0">
          Entregado: {formatearFecha(req.completado_at)}
        </span>
      )}
      <Badge config={getEstado(req.estado)} size="sm" />
      <Badge config={getPrioridad(req.prioridad)} size="sm" />
      <Badge config={getTipo(req.tipo)} size="sm" />
      {puedeEditar && (
        <button
          onClick={() => onRemove(req.id)}
          aria-label="Eliminar"
          className={`${isTouch ? 'opacity-100' : 'opacity-0 group-hover/req:opacity-100'} w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] text-quinto/30 hover:text-quinto-claro transition-all duration-200 focus:outline-none flex-shrink-0`}
        >
          <FontAwesomeIcon icon={faTrash} className="text-[0.8em]" />
        </button>
      )}
    </li>
  );
}

export default CompletedRequirementItem;
