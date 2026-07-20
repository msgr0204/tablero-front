import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faPen, faTrash, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Badge from '../../../components/Badge';
import ConfirmDiscardModal from '../../../components/ConfirmDiscardModal';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';

const DEFAULT_COLOR = '#38BDF8';

function EstadoPrioridadItem({ item, isEstado, onUpdate, onRemove, nombreEntidad }) {
  const isTouch = useIsTouchDevice();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(item.label);
  const [color, setColor] = useState(item.color?.startsWith('#') ? item.color : DEFAULT_COLOR);
  const [esEstadoFinal, setEsEstadoFinal] = useState(item.es_estado_final ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [removing, setRemoving] = useState(false);

  const isDirty =
    label.trim() !== item.label ||
    color !== (item.color?.startsWith('#') ? item.color : DEFAULT_COLOR) ||
    esEstadoFinal !== (item.es_estado_final ?? false);

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const handleSave = async () => {
    if (!label.trim()) return;
    if (!isDirty) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { label: label.trim(), color };
      if (isEstado) payload.es_estado_final = esEstadoFinal;
      await onUpdate(item.id, payload);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setLabel(item.label);
    setColor(item.color?.startsWith('#') ? item.color : DEFAULT_COLOR);
    setEsEstadoFinal(item.es_estado_final ?? false);
    setError('');
    setEditing(false);
  };

  const handleCancel = () => {
    if (isDirty) {
      setConfirmingDiscard(true);
      return;
    }
    resetForm();
  };

  const handleDiscard = () => {
    setConfirmingDiscard(false);
    resetForm();
  };

  const handleConfirmRemove = async () => {
    setError('');
    setRemoving(true);
    try {
      await onRemove(item.id);
      setConfirmingDelete(false);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      setConfirmingDelete(false);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-[0.5em] bg-primero-claro border border-cuarto/10 rounded-[0.6em] px-[0.85em] py-[0.7em] group"
    >
      <div className="flex items-center gap-[0.6em] flex-wrap">
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label="Arrastrar"
          style={{ touchAction: 'none' }}
          className={[
            'flex items-center justify-center w-[1.75em] h-[1.75em] rounded-[0.4em] flex-shrink-0',
            'text-cuarto/30 hover:text-segundo/60 hover:bg-segundo/10',
            'transition-all duration-200 cursor-grab active:cursor-grabbing',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50',
            isTouch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          ].join(' ')}
        >
          <FontAwesomeIcon icon={faGripVertical} className="text-[0.75em]" />
        </div>

        <span className="text-[0.75em] font-mono text-cuarto/30 w-[6em] truncate flex-shrink-0">{item.value}</span>

        {!editing ? (
          <>
            <Badge config={item} />
            {isEstado && item.es_estado_final && (
              <span className="text-[0.75em] text-segundo/60 font-roboto italic">Estado de cierre</span>
            )}
            <div className="flex-1" />
            <button
              onClick={() => setEditing(true)}
              aria-label="Editar"
              className="w-[2em] h-[2em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none flex-shrink-0"
            >
              <FontAwesomeIcon icon={faPen} className="text-[0.8em]" />
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              aria-label="Eliminar"
              className="w-[2em] h-[2em] flex items-center justify-center rounded-[0.5em] text-quinto/40 hover:text-quinto-claro hover:bg-quinto/10 transition-all duration-200 focus:outline-none flex-shrink-0"
            >
              <FontAwesomeIcon icon={faTrash} className="text-[0.8em]" />
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center gap-[0.5em] flex-wrap">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
              className="h-[2.25em] px-[0.75em] rounded-[0.5em] text-[0.85em] font-roboto bg-primero-claro/60 text-cuarto border border-cuarto/10 hover:border-cuarto/20 focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40 outline-none flex-1 min-w-[8.5em]"
            />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Color"
              className="w-[2.25em] h-[2.25em] rounded-[0.5em] border border-cuarto/10 bg-primero-claro/60 cursor-pointer"
            />
            {isEstado && (
              <label className="flex items-center gap-[0.4em] text-[0.75em] text-cuarto/60 font-roboto cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={esEstadoFinal}
                  onChange={(e) => setEsEstadoFinal(e.target.checked)}
                  className="accent-segundo"
                />
                Estado de cierre
              </label>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !label.trim()}
              aria-label="Guardar"
              className="w-[2em] h-[2em] flex items-center justify-center rounded-[0.5em] bg-segundo/10 border border-segundo/30 text-segundo hover:bg-segundo/20 transition-all duration-200 disabled:opacity-40 focus:outline-none flex-shrink-0"
            >
              {saving
                ? <div className="w-[0.75em] h-[0.75em] border border-segundo/40 border-t-segundo rounded-full animate-spin" />
                : <FontAwesomeIcon icon={faCheck} className="text-[0.8em]" />
              }
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              aria-label="Cancelar"
              className="w-[2em] h-[2em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:bg-cuarto/10 transition-all duration-200 focus:outline-none flex-shrink-0"
            >
              <FontAwesomeIcon icon={faXmark} className="text-[0.8em]" />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-[0.75em] text-quinto-claro font-roboto">{error}</p>}

      <ConfirmDiscardModal
        isOpen={confirmingDiscard}
        onCancel={() => setConfirmingDiscard(false)}
        onDiscard={handleDiscard}
      />

      <ConfirmDeleteModal
        isOpen={confirmingDelete}
        confirming={removing}
        label={`${nombreEntidad} "${item.label}"`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={handleConfirmRemove}
      />
    </li>
  );
}

export default EstadoPrioridadItem;
