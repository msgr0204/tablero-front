import { faCircleInfo, faListCheck, faCommentDots, faCircleCheck, faCalendarDay, faUser, faClock, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/Modal';
import Badge from '../../../components/Badge';
import { Seccion } from '../../../components/FormKit';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import { formatearFecha, formatearFechaHora } from '../../../lib/formatFecha';

// Cifra grande con su rótulo. Los conteos eran una fila más de la lista, con el
// mismo peso que "Última edición"; son lo primero que se busca al abrir la ficha,
// así que suben arriba y se leen de un vistazo.
function Metrica({ icon, valor, label, acento = false }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[0.25em] rounded-[0.75em] border border-cuarto/10 bg-primero-claro/40 py-[0.85em] px-[0.5em]">
      <FontAwesomeIcon icon={icon} className={`text-[0.85em] ${acento ? 'text-segundo/70' : 'text-cuarto/30'}`} />
      <span className={`text-[1.25em] font-bold font-poppins tabular-nums leading-none ${acento ? 'text-segundo' : 'text-cuarto'}`}>{valor}</span>
      <span className="text-[0.65em] text-cuarto/40 font-poppins uppercase tracking-wider text-center leading-tight">{label}</span>
    </div>
  );
}

function Fila({ icon, label, children }) {
  return (
    <div className="flex items-baseline gap-[0.75em] py-[0.5em] border-b border-cuarto/[0.07] last:border-b-0">
      <span className="flex items-center gap-[0.5em] text-[0.8em] text-cuarto/40 font-roboto w-[9em] flex-shrink-0">
        {icon && <FontAwesomeIcon icon={icon} className="text-[0.85em] text-cuarto/25 w-[1em]" />}
        {label}
      </span>
      <div className="flex-1 min-w-0 text-[0.85em] text-cuarto/80 font-roboto">{children}</div>
    </div>
  );
}

function ModuleInfoModal({ isOpen, onClose, module }) {
  const { getEstado, getPrioridad, esEstadoFinal } = useEstadosPrioridades();
  if (!module) return null;

  const reqs = module.requerimientos ?? [];
  const completados = reqs.filter((r) => r.completado).length;
  const pendientes = reqs.length - completados;
  const totalObservaciones = (module.observaciones ?? []).length;
  const entregado = esEstadoFinal(module.estado);

  return (
    <Modal isOpen={isOpen} onClose={onClose} eyebrow={module.nombre} title="Información del módulo" icon={faCircleInfo} size="lg">
      <div className="flex flex-col gap-[1.5em]">
        {module.descripcion
          ? <p className="text-[0.9em] text-cuarto/70 font-roboto leading-relaxed">{module.descripcion}</p>
          : <p className="text-[0.85em] text-cuarto/25 font-roboto italic">Sin descripción</p>
        }

        <div className="grid grid-cols-3 gap-[0.6em]">
          <Metrica icon={faListCheck} valor={pendientes} label="Pendientes" acento={pendientes > 0} />
          <Metrica icon={faCircleCheck} valor={completados} label="Completados" />
          <Metrica icon={faCommentDots} valor={totalObservaciones} label="Observaciones" />
        </div>

        <Seccion titulo="Clasificación">
          <div className="flex flex-col">
            <Fila label="Estado">
              {getEstado(module.estado)
                ? <Badge config={getEstado(module.estado)} size="sm" />
                : <span className="text-cuarto/30 italic">Sin estado</span>}
            </Fila>
            <Fila label="Prioridad">
              {getPrioridad(module.prioridad)
                ? <Badge config={getPrioridad(module.prioridad)} size="sm" />
                : <span className="text-cuarto/30 italic">{entregado ? 'No aplica' : 'Sin prioridad'}</span>}
            </Fila>
            <Fila icon={faCalendarDay} label={entregado ? 'Entregado' : 'Fecha de entrega'}>
              {module.fecha_entrega
                ? <span className={entregado ? 'text-segundo/70 font-semibold' : 'font-semibold text-segundo'}>{formatearFecha(module.fecha_entrega)}</span>
                : <span className="text-cuarto/30 italic">Sin fecha</span>}
            </Fila>
          </div>
        </Seccion>

        <Seccion titulo="Registro">
          <div className="flex flex-col">
            <Fila icon={faUser} label="Creado por">{module.creado_por || '—'}</Fila>
            <Fila icon={faClock} label="Creado">{formatearFechaHora(module.created_at)}</Fila>
            <Fila icon={faPenToSquare} label="Última edición">{formatearFechaHora(module.updated_at)}</Fila>
          </div>
        </Seccion>
      </div>
    </Modal>
  );
}

export default ModuleInfoModal;
