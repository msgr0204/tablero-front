import Modal from '../../../components/Modal';
import Badge from '../../../components/Badge';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import { formatearFecha, formatearFechaHora } from '../../../lib/formatFecha';

function Fila({ label, children }) {
  return (
    <div className="flex items-baseline gap-[0.75em] py-[0.5em] border-b border-cuarto/10 last:border-b-0">
      <span className="text-[0.8em] text-cuarto/40 font-roboto w-[8em] flex-shrink-0">{label}</span>
      <div className="flex-1 min-w-0 text-[0.85em] text-cuarto/80 font-roboto">{children}</div>
    </div>
  );
}

function ModuleInfoModal({ isOpen, onClose, module }) {
  const { getEstado, getPrioridad } = useEstadosPrioridades();
  if (!module) return null;

  const totalRequerimientos = (module.requerimientos ?? []).length;
  const totalObservaciones = (module.observaciones ?? []).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Información del módulo" size="lg">
      <div className="flex flex-col gap-[1em]">
        <div>
          <h3 className="text-[1.1em] font-bold font-poppins text-cuarto leading-tight">{module.nombre}</h3>
          {module.descripcion
            ? <p className="text-[0.85em] text-cuarto/60 font-roboto mt-[0.3em]">{module.descripcion}</p>
            : <p className="text-[0.85em] text-cuarto/25 font-roboto italic mt-[0.3em]">Sin descripción</p>
          }
        </div>

        <div className="flex flex-col">
          <Fila label="Estado">
            {getEstado(module.estado) ? <Badge config={getEstado(module.estado)} size="sm" /> : <span className="text-cuarto/30 italic">Sin estado</span>}
          </Fila>
          <Fila label="Prioridad">
            {getPrioridad(module.prioridad) ? <Badge config={getPrioridad(module.prioridad)} size="sm" /> : <span className="text-cuarto/30 italic">Sin prioridad</span>}
          </Fila>
          <Fila label="Creado por">{module.creado_por || '—'}</Fila>
          <Fila label="Creado">{formatearFechaHora(module.created_at)}</Fila>
          <Fila label="Última edición">{formatearFechaHora(module.updated_at)}</Fila>
          <Fila label="Fecha de entrega">
            {module.fecha_entrega ? formatearFecha(module.fecha_entrega) : <span className="text-cuarto/30 italic">Sin fecha</span>}
          </Fila>
          <Fila label="Días máximos">
            {module.dias_maximos ? <span className="font-mono font-bold tracking-widest text-cuarto/60">D{module.dias_maximos}DM</span> : <span className="text-cuarto/30 italic">—</span>}
          </Fila>
          <Fila label="Requerimientos">{totalRequerimientos}</Fila>
          <Fila label="Observaciones">{totalObservaciones}</Fila>
        </div>
      </div>
    </Modal>
  );
}

export default ModuleInfoModal;
