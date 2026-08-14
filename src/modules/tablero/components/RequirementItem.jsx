import { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faPen, faCheck, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import Badge from '../../../components/Badge';
import StatusFields from './StatusFields';
import DeliveryFields from './DeliveryFields';
import ObservationList from './ObservationList';
import ConfirmDiscardModal from '../../../components/ConfirmDiscardModal';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import { formatearFecha, formatearFechaHora } from '../../../lib/formatFecha';

function RequirementItem({ req, index, onUpdate, onRemove, onAddObs, onToggle, selected, onSelect }) {
  const isTouch = useIsTouchDevice();
  const { getEstado, getPrioridad, getTipo, esEstadoFinal } = useEstadosPrioridades();
  const [editing, setEditing] = useState(false);
  const [texto, setTexto] = useState(req.texto);
  const [estado, setEstado] = useState(req.estado ?? '');
  const [prioridad, setPrioridad] = useState(req.prioridad ?? '');
  const [tipo, setTipo] = useState(req.tipo ?? '');
  const [fechaEntrega, setFechaEntrega] = useState(req.fecha_entrega ?? '');
  const [diasMaximos, setDiasMaximos] = useState(req.dias_maximos ?? '');
  const [saving, setSaving] = useState(false);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const inputRef = useRef(null);

  const esFinal = estado && esEstadoFinal(estado);
  const isDirty =
    texto.trim() !== req.texto ||
    (estado || null) !== (req.estado ?? null) ||
    (esFinal ? null : (prioridad || null)) !== (req.prioridad ?? null) ||
    (esFinal ? null : (tipo || null)) !== (req.tipo ?? null) ||
    (fechaEntrega || null) !== (req.fecha_entrega ?? null) ||
    (diasMaximos !== '' ? parseInt(diasMaximos, 10) : null) !== (req.dias_maximos ?? null);

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: req.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEdit = () => {
    setTexto(req.texto);
    setEstado(req.estado ?? '');
    setPrioridad(req.prioridad ?? '');
    setTipo(req.tipo ?? '');
    setFechaEntrega(req.fecha_entrega ?? '');
    setDiasMaximos(req.dias_maximos ?? '');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!texto.trim()) return;
    if (!isDirty) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onUpdate(req.id, {
        texto: texto.trim(),
        estado: estado || null,
        prioridad: esFinal ? null : (prioridad || null),
        tipo: esFinal ? null : (tipo || null),
        fecha_entrega: fechaEntrega || null,
        dias_maximos: diasMaximos !== '' ? parseInt(diasMaximos, 10) : null,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setConfirmingDiscard(true);
      return;
    }
    setEditing(false);
  };

  const handleDiscard = () => {
    setConfirmingDiscard(false);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <li ref={setNodeRef} style={style} className="flex flex-col gap-[0.5em] group/req">
      <div className={`flex items-center gap-[0.6em] border rounded-[0.6em] px-[0.85em] py-[0.7em] transition-colors duration-200 min-w-0 ${selected ? 'bg-segundo/10 border-segundo/40' : 'bg-primero/40 border-cuarto/10 hover:border-cuarto/20'}`}>
        <button
          onClick={() => onToggle(req.id, true)}
          aria-label="Marcar como completado"
          className="w-[1.4em] h-[1.4em] rounded-full border-2 border-cuarto/25 hover:border-segundo hover:bg-segundo/10 transition-all duration-200 flex-shrink-0 focus:outline-none"
        />
        <span className="text-[0.8em] text-segundo/40 font-poppins font-semibold w-[1.5em] flex-shrink-0 tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>

        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-[0.9em] font-roboto text-cuarto bg-primero-claro/60 border border-segundo/40 rounded-[0.4em] px-[0.6em] py-[0.3em] outline-none focus:ring-1 focus:ring-segundo/40"
          />
        ) : (
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect(req.id)}>
            <span className="text-[0.9em] text-cuarto/80 font-roboto leading-snug min-w-0 truncate block">
              {req.texto}
            </span>
            <div className="flex items-center gap-[0.4em] flex-wrap mt-[0.3em]">
              <Badge config={getEstado(req.estado)} size="sm" />
              <Badge config={getPrioridad(req.prioridad)} size="sm" />
              <Badge config={getTipo(req.tipo)} size="sm" />
            </div>
            <div className="flex items-center gap-[0.75em] flex-wrap mt-[0.2em]">
              {req.creado_por && (
                <span className="text-[0.75em] text-segundo/40 font-roboto">Creado por: {req.creado_por}</span>
              )}
              {req.created_at && (
                <span className="text-[0.75em] text-cuarto/40 font-roboto">Creado: {formatearFechaHora(req.created_at)}</span>
              )}
              {req.fecha_entrega && (
                <span className="text-[0.75em] font-roboto font-medium text-segundo">
                  Entrega: {formatearFecha(req.fecha_entrega)}
                </span>
              )}
              {req.dias_maximos && (
                <span className="text-[0.75em] font-mono font-bold tracking-widest text-cuarto/25">D{req.dias_maximos}DM</span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-[0.2em] flex-shrink-0">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving} aria-label="Guardar" className="w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] text-segundo hover:bg-segundo/10 transition-colors focus:outline-none">
                {saving
                  ? <div className="w-[0.85em] h-[0.85em] border border-segundo/40 border-t-segundo rounded-full animate-spin" />
                  : <FontAwesomeIcon icon={faCheck} className="text-[0.8em]" />
                }
              </button>
              <button onClick={handleCancel} aria-label="Cancelar" className="w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] text-cuarto/40 hover:bg-cuarto/10 transition-colors focus:outline-none">
                <FontAwesomeIcon icon={faXmark} className="text-[0.8em]" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startEdit}
                aria-label="Editar requerimiento"
                className={`${isTouch ? 'opacity-100' : 'opacity-0 group-hover/req:opacity-100'} w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] text-cuarto/30 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none focus:opacity-100`}
              >
                <FontAwesomeIcon icon={faPen} className="text-[0.8em]" />
              </button>
              <button
                onClick={() => onRemove(req.id)}
                aria-label="Eliminar requerimiento"
                className={`${isTouch ? 'opacity-100' : 'opacity-0 group-hover/req:opacity-100'} w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] text-quinto/40 hover:text-quinto-claro hover:bg-quinto/10 transition-all duration-200 focus:outline-none focus:opacity-100`}
              >
                <FontAwesomeIcon icon={faTrash} className="text-[0.8em]" />
              </button>
              <div
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                style={{ touchAction: 'none' }}
                aria-label="Arrastrar requerimiento"
                className={[
                  'w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] text-cuarto/20 hover:text-segundo/60 cursor-grab active:cursor-grabbing transition-all duration-200 focus:outline-none',
                  isTouch ? 'opacity-100' : 'opacity-0 group-hover/req:opacity-100',
                ].join(' ')}
              >
                <FontAwesomeIcon icon={faGripVertical} className="text-[0.8em]" />
              </div>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="ml-[1.9em] flex flex-col gap-[0.6em]">
          <StatusFields
            estado={estado} onEstadoChange={setEstado}
            prioridad={prioridad} onPrioridadChange={setPrioridad}
            tipo={tipo} onTipoChange={setTipo}
            conTipo
            size="sm"
          />
          <DeliveryFields fecha={fechaEntrega} onFechaChange={setFechaEntrega} diasMaximos={diasMaximos} onDiasMaximosChange={setDiasMaximos} />
        </div>
      )}

      {!editing && selected && (
        <div className="ml-[1.9em]">
          <ObservationList
            observaciones={req.observaciones ?? []}
            onAdd={(texto) => onAddObs(req.id, texto)}
            draftKey={`obs_req_${req.id}`}
            hideList
          />
        </div>
      )}

      <ConfirmDiscardModal
        isOpen={confirmingDiscard}
        onCancel={() => setConfirmingDiscard(false)}
        onDiscard={handleDiscard}
      />
    </li>
  );
}

export default RequirementItem;
