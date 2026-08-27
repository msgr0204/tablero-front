import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faPen, faListCheck, faTrash, faCircleInfo, faFlag } from '@fortawesome/free-solid-svg-icons';
import Badge from '../../../components/Badge';
import ModuleInfoModal from './ModuleInfoModal';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';
import useDraft from '../../../hooks/useDraft';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import usePermisosTablero from '../hooks/usePermisosTablero';
import { formatearFecha } from '../../../lib/formatFecha';

// Un requerimiento sin prioridad, o con una prioridad ya inexistente, va al
// final. Los demás se ordenan por el campo `orden` del catálogo (Crítica=0,
// Alta=1, ...), respetando la jerarquía que el tenant definió en Configuración.
function ordenarPorPrioridad(reqs, getPrioridad) {
  const peso = (req) => {
    const prioridad = getPrioridad(req.prioridad);
    return prioridad ? prioridad.orden : Number.MAX_SAFE_INTEGER;
  };
  return [...reqs].sort((a, b) => peso(a) - peso(b));
}

function ModuleCard({ module, onView, onEdit, onRemove, dragHandle }) {
  const { getEstado, getPrioridad } = useEstadosPrioridades();
  const { puedeModificarItem } = usePermisosTablero();
  const puedeEditar = puedeModificarItem(module);
  const isTouch = useIsTouchDevice();
  const [infoOpen, setInfoOpen] = useState(false);
  const [porPrioridad, setPorPrioridad] = useDraft(`modcard_prio_${module.id}`, false);
  const visibilityClass = isTouch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100';
  const reqsBase = module.requerimientos ?? [];
  const reqs = porPrioridad ? ordenarPorPrioridad(reqsBase, getPrioridad) : reqsBase;

  return (
    <div
      onClick={() => onView(module)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onView(module); }}
      className="flex h-full overflow-hidden rounded-[0.85em] bg-primero-claro border border-cuarto/10 hover:border-segundo/30 hover:shadow-lg hover:shadow-primero-oscuro/40 active:scale-[0.99] cursor-pointer transition-all duration-200 group sm:min-h-[21em]"
    >
      <div className="w-[0.25em] flex-shrink-0 bg-segundo/60" />

      <div className="flex-1 flex flex-col p-[1em] sm:p-[1.25em] min-w-0">
        <div className="flex items-start justify-between gap-[0.5em] mb-[0.6em] min-h-[1.4em]">
          <div className="flex items-center gap-[0.4em] flex-wrap min-w-0">
            <span className="inline-flex items-center px-[0.6em] py-[0.15em] rounded-[0.4em] bg-segundo/10 border border-segundo/20 text-segundo text-[0.75em] font-poppins font-medium">
              Módulo
            </span>
            <Badge config={getEstado(module.estado)} size="sm" />
            <Badge config={getPrioridad(module.prioridad)} size="sm" />
          </div>
          <div className="flex items-center gap-[0.1em] flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setInfoOpen(true); }}
              aria-label="Ver información del módulo"
              className={`w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] ${visibilityClass} focus:opacity-100 text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50`}
            >
              <FontAwesomeIcon icon={faCircleInfo} className="text-[0.75em]" />
            </button>
            {puedeEditar && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(module); }}
                  aria-label="Editar módulo"
                  className={`w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] ${visibilityClass} focus:opacity-100 text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50`}
                >
                  <FontAwesomeIcon icon={faPen} className="text-[0.75em]" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(module.id); }}
                  aria-label="Eliminar módulo"
                  className={`w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] ${visibilityClass} focus:opacity-100 text-quinto/40 hover:text-quinto-claro hover:bg-quinto/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-quinto/50`}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-[0.75em]" />
                </button>
              </>
            )}
            {dragHandle}
          </div>
        </div>

        <div className="flex items-center gap-[0.75em] mb-[0.75em] sm:mb-[1em] min-w-0">
          <div className="w-[2.25em] h-[2.25em] rounded-[0.5em] bg-segundo/10 border border-segundo/20 flex items-center justify-center flex-shrink-0 group-hover:bg-segundo/20 transition-colors duration-200">
            <FontAwesomeIcon icon={faCubes} className="text-segundo text-[0.9em]" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.95em] sm:text-[1.05em] font-bold font-poppins text-cuarto truncate leading-tight">
              {module.nombre}
            </p>
            {module.descripcion
              ? <p className="text-[0.75em] text-cuarto/40 mt-[0.1em] truncate">{module.descripcion}</p>
              : <p className="text-[0.75em] text-cuarto/20 mt-[0.1em] italic">Sin descripción</p>
            }
            {module.creado_por && (
              <p className="text-[0.75em] text-segundo/50 mt-[0.1em] font-roboto truncate">
                Creado por: {module.creado_por}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-[0.5em] mb-[0.5em]">
            <FontAwesomeIcon icon={faListCheck} className="text-segundo/50 text-[0.75em]" />
            <span className="text-[0.75em] font-semibold text-cuarto/40 font-poppins uppercase tracking-wider">
              Requerimientos
            </span>
            {reqs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setPorPrioridad((p) => !p); }}
                aria-label={porPrioridad ? 'Quitar orden por prioridad' : 'Ordenar por prioridad'}
                aria-pressed={porPrioridad}
                title={porPrioridad ? 'Orden por prioridad activo' : 'Ordenar por prioridad'}
                className={[
                  'flex items-center gap-[0.3em] px-[0.5em] h-[1.6em] rounded-[0.4em] text-[0.7em] font-poppins font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50',
                  porPrioridad
                    ? 'bg-segundo/15 border border-segundo/30 text-segundo'
                    : 'border border-cuarto/10 text-cuarto/40 hover:text-segundo hover:border-segundo/30',
                ].join(' ')}
              >
                <FontAwesomeIcon icon={faFlag} className="text-[0.85em]" />
                Prioridad
              </button>
            )}
            <span className="ml-auto text-[0.75em] text-segundo/60 font-poppins font-semibold">
              {reqs.length}
            </span>
          </div>

          <div className="sm:h-[9.5em] overflow-y-auto">
            {reqs.length === 0 ? (
              <div className="h-[5em] sm:h-full flex items-center justify-center border border-dashed border-cuarto/15 rounded-[0.5em]">
                <p className="text-[0.75em] text-cuarto/20 italic font-roboto">Sin requerimientos aún</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-[0.4em] pr-[0.1em]">
                {reqs.map((req, index) => (
                  <li key={req.id} className="flex items-center gap-[0.6em] py-[0.5em] px-[0.6em] rounded-[0.5em] bg-primero/40 border border-cuarto/10 min-w-0">
                    <span className="text-[0.75em] text-segundo/40 font-poppins font-semibold w-[1.25em] flex-shrink-0 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[0.75em] text-cuarto/70 font-roboto truncate flex-1 min-w-0">
                      {req.texto}
                    </span>
                    {getPrioridad(req.prioridad) && (
                      <span className="flex-shrink-0">
                        <Badge config={getPrioridad(req.prioridad)} size="sm" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-auto pt-[0.75em] border-t border-cuarto/10 flex items-center justify-between gap-[0.5em]">
          <div className="flex flex-col gap-[0.1em] min-w-0">
            <span className="text-[0.75em] text-cuarto/25 font-roboto uppercase tracking-wider">
              {(module.observaciones ?? []).length > 0 ? `${module.observaciones.length} obs.` : 'Sin obs.'}
            </span>
            {module.fecha_entrega ? (
              <span className="text-[0.75em] font-roboto font-semibold truncate text-segundo">
                Entrega: {formatearFecha(module.fecha_entrega)}
              </span>
            ) : (
              <span className="text-[0.75em] text-cuarto/20 font-roboto italic">Sin fecha de entrega</span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onView(module); }}
            className="flex-shrink-0 px-[0.75em] h-[1.75em] rounded-[0.5em] text-[0.75em] font-semibold font-poppins bg-segundo/10 border border-segundo/25 text-segundo hover:bg-segundo/20 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
          >
            Ver más
          </button>
        </div>
      </div>

      <span onClick={(e) => e.stopPropagation()}>
        <ModuleInfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} module={module} />
      </span>
    </div>
  );
}

export default ModuleCard;
