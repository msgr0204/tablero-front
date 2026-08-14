import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faGripVertical, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Badge from '../../../components/Badge';
import Select from '../../../components/Select';
import ConfirmDiscardModal from '../../../components/ConfirmDiscardModal';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import { formatearFecha, formatearFechaHora } from '../../../lib/formatFecha';

function CategoryCard({ category, onUpdate, onRemove, dragHandle, autoEdit, onAutoEditDone }) {
  const navigate = useNavigate();
  const { esEstadoFinal, getEstado, getPrioridad, estados, prioridades } = useEstadosPrioridades();
  const cardRef = useRef(null);
  const [editing, setEditing] = useState(autoEdit ?? false);
  const [nombre, setNombre] = useState(category.nombre);
  const [descripcion, setDescripcion] = useState(category.descripcion ?? '');
  const [fechaEntrega, setFechaEntrega] = useState(category.fecha_entrega ?? '');
  const [diasMaximos, setDiasMaximos] = useState(category.dias_maximos ?? '');
  const [estado, setEstado] = useState(category.estado ?? '');
  const [prioridad, setPrioridad] = useState(category.prioridad ?? '');
  const [saving, setSaving] = useState(false);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  const isDirty =
    nombre.trim() !== category.nombre ||
    descripcion.trim() !== (category.descripcion ?? '') ||
    (fechaEntrega || null) !== (category.fecha_entrega ?? null) ||
    (diasMaximos !== '' ? parseInt(diasMaximos, 10) : null) !== (category.dias_maximos ?? null) ||
    (estado || null) !== (category.estado ?? null) ||
    ((estado && esEstadoFinal(estado)) ? null : (prioridad || null)) !== (category.prioridad ?? null);

  useEffect(() => {
    if (autoEdit) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [autoEdit]);

  const handleNavigate = () => {
    if (!editing) navigate(`/tablero/${category.id}/modulos`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setNombre(category.nombre);
    setDescripcion(category.descripcion ?? '');
    setFechaEntrega(category.fecha_entrega ?? '');
    setDiasMaximos(category.dias_maximos ?? '');
    setEstado(category.estado ?? '');
    setPrioridad(category.prioridad ?? '');
    setEditing(true);
  };

  const cerrarEdicion = () => {
    setEditing(false);
    if (autoEdit) onAutoEditDone?.();
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    if (isDirty) {
      setConfirmingDiscard(true);
      return;
    }
    cerrarEdicion();
  };

  const handleDiscard = () => {
    setConfirmingDiscard(false);
    cerrarEdicion();
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!nombre.trim()) return;
    if (!isDirty) {
      cerrarEdicion();
      return;
    }
    setSaving(true);
    try {
      await onUpdate(category.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        fecha_entrega: fechaEntrega || null,
        dias_maximos: diasMaximos !== '' ? parseInt(diasMaximos, 10) : null,
        estado: estado || null,
        prioridad: (estado && esEstadoFinal(estado)) ? null : (prioridad || null),
      });
      cerrarEdicion();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleNavigate}
      role={editing ? undefined : 'button'}
      tabIndex={editing ? undefined : 0}
      onKeyDown={(e) => { if (!editing && e.key === 'Enter') handleNavigate(); }}
      className={[
        'relative flex h-full overflow-hidden rounded-[0.85em] bg-primero-claro border transition-all duration-200',
        !editing && 'border-cuarto/10 hover:border-segundo/40 hover:shadow-lg hover:shadow-primero-oscuro/40 cursor-pointer active:scale-[0.99] group',
        editing && 'border-segundo/40 shadow-lg shadow-primero-oscuro/40',
      ].filter(Boolean).join(' ')}
    >
      <div className="w-[0.25em] flex-shrink-0 bg-segundo" />

      <div className="flex-1 flex flex-col px-[1em] sm:px-[1.25em] py-[1em] sm:py-[1.25em] min-w-0">
        {!editing ? (
          <ViewMode
            category={category}
            onEdit={handleEdit}
            onRemove={onRemove}
            dragHandle={dragHandle}
            getEstado={getEstado}
            getPrioridad={getPrioridad}
          />
        ) : (
          <EditMode
            nombre={nombre}
            descripcion={descripcion}
            fechaEntrega={fechaEntrega}
            diasMaximos={diasMaximos}
            estado={estado}
            prioridad={prioridad}
            saving={saving}
            estados={estados}
            prioridades={prioridades}
            esEstadoFinal={esEstadoFinal}
            onNombreChange={setNombre}
            onDescripcionChange={setDescripcion}
            onFechaEntregaChange={setFechaEntrega}
            onDiasMaximosChange={setDiasMaximos}
            onEstadoChange={setEstado}
            onPrioridadChange={setPrioridad}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>

      <ConfirmDiscardModal
        isOpen={confirmingDiscard}
        onCancel={() => setConfirmingDiscard(false)}
        onDiscard={handleDiscard}
      />
    </div>
  );
}

function ViewMode({ category, onEdit, onRemove, dragHandle, getEstado, getPrioridad }) {
  const isTouch = useIsTouchDevice();
  const visibilityClass = isTouch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-start justify-between gap-[0.5em] mb-[0.5em] min-h-[1.4em]">
        <div className="flex items-center gap-[0.4em] flex-wrap min-w-0">
          <span className="inline-flex items-center px-[0.6em] py-[0.15em] rounded-[0.4em] bg-segundo/10 border border-segundo/20 text-segundo text-[0.75em] font-poppins font-medium">
            Categoría
          </span>
          <Badge config={getEstado(category.estado)} />
          <Badge config={getPrioridad(category.prioridad)} />
        </div>
        <div className="flex items-center gap-[0.1em] flex-shrink-0">
          <button
            onClick={onEdit}
            aria-label="Editar categoría"
            className={`w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] ${visibilityClass} focus:opacity-100 text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50`}
          >
            <FontAwesomeIcon icon={faPen} className="text-[0.75em]" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(category.id); }}
            aria-label="Eliminar categoría"
            className={`w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] ${visibilityClass} focus:opacity-100 text-quinto/40 hover:text-quinto-claro hover:bg-quinto/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-quinto/50`}
          >
            <FontAwesomeIcon icon={faTrash} className="text-[0.75em]" />
          </button>
          {dragHandle ?? (
            <span className={`w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] text-cuarto/20 ${visibilityClass} transition-all duration-200 cursor-grab`}>
              <FontAwesomeIcon icon={faGripVertical} className="text-[0.75em]" />
            </span>
          )}
        </div>
      </div>

      <h3 className="text-[1.15em] sm:text-[1.3em] font-bold font-poppins text-cuarto leading-tight mb-[0.75em] truncate">
        {category.nombre}
      </h3>

      <div className="flex flex-col gap-[0.3em] mb-[1em]">
        <InfoRow label="Descripción" value={category.descripcion || '—'} />
        <InfoRow label="Módulos" value={category.totalModulos ?? 0} />
        <DeliveryRow fecha={category.fecha_entrega} />
        <IdRow diasMaximos={category.dias_maximos} />
      </div>

      <div className="mt-auto pt-[0.75em] border-t border-cuarto/10 flex flex-col gap-[0.4em]">
        <span className="text-[0.7em] text-cuarto/30 font-roboto">
          Creado por {category.creado_por || '—'} el {formatearFechaHora(category.created_at)}
        </span>
        <div className="flex items-center justify-between">
          <span className="text-[0.7em] text-cuarto/30 font-roboto uppercase tracking-wider">
            Total requerimientos
          </span>
          <span className="text-[0.95em] font-bold font-poppins text-segundo">
            {category.totalRequerimientos ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function EditMode({
  nombre, descripcion, fechaEntrega, diasMaximos, estado, prioridad, saving,
  estados, prioridades, esEstadoFinal,
  onNombreChange, onDescripcionChange, onFechaEntregaChange, onDiasMaximosChange,
  onEstadoChange, onPrioridadChange, onSave, onCancel,
}) {
  const codigo = diasMaximos !== '' && !isNaN(parseInt(diasMaximos, 10))
    ? `D${parseInt(diasMaximos, 10)}DM`
    : null;

  const fieldClass = 'w-full h-[2.5em] px-[0.75em] rounded-[0.5em] text-[0.85em] font-roboto bg-primero-claro/60 text-cuarto border border-cuarto/10 hover:border-cuarto/20 focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40 outline-none transition-all duration-200';

  return (
    <div className="flex-1 flex flex-col gap-[0.85em]" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <span className="text-[0.75em] font-semibold text-cuarto/50 font-poppins uppercase tracking-wider">
          Editando categoría
        </span>
        <div className="flex items-center gap-[0.4em]">
          <button
            onClick={onCancel}
            disabled={saving}
            aria-label="Cancelar edición"
            className="w-[2.5em] h-[2.5em] sm:w-[2em] sm:h-[2em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:text-cuarto hover:bg-cuarto/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <button
            onClick={onSave}
            disabled={saving || !nombre.trim()}
            aria-label="Guardar cambios"
            className="w-[2.5em] h-[2.5em] sm:w-[2em] sm:h-[2em] flex items-center justify-center rounded-[0.5em] bg-segundo/10 border border-segundo/30 text-segundo hover:bg-segundo/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 disabled:opacity-40"
          >
            {saving
              ? <div className="w-[0.85em] h-[0.85em] border border-segundo/40 border-t-segundo rounded-full animate-spin" />
              : <FontAwesomeIcon icon={faCheck} />
            }
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[0.3em]">
        <label className="text-[0.75em] text-cuarto/50 font-roboto">Nombre *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => onNombreChange(e.target.value)}
          autoFocus
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-[0.3em]">
        <label className="text-[0.75em] text-cuarto/50 font-roboto">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => onDescripcionChange(e.target.value)}
          rows={2}
          className={`${fieldClass} h-auto py-[0.5em] resize-none`}
        />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-[0.6em]">
        <div className="flex flex-col gap-[0.3em] min-w-0">
          <label className="text-[0.75em] text-cuarto/50 font-roboto">Fecha de entrega</label>
          <input
            type="date"
            value={fechaEntrega}
            onChange={(e) => onFechaEntregaChange(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-[0.3em] w-[5.5em] flex-shrink-0">
          <div className="flex items-center justify-between gap-[0.25em]">
            <label className="text-[0.75em] text-cuarto/50 font-roboto">ID</label>
            {codigo && (
              <span className="text-[0.7em] font-mono font-bold tracking-widest text-cuarto/40 select-all truncate">
                {codigo}
              </span>
            )}
          </div>
          <input
            type="number"
            min="1"
            value={diasMaximos}
            onChange={(e) => onDiasMaximosChange(e.target.value)}
            placeholder="—"
            className={`${fieldClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[0.6em]">
        <div className="flex flex-col gap-[0.3em]">
          <label className="text-[0.75em] text-cuarto/50 font-roboto">Estado</label>
          <Select
            value={estado}
            onChange={onEstadoChange}
            placeholder="Sin estado"
            options={[{ value: '', label: 'Sin estado' }, ...estados.map((e) => ({ value: e.id, label: e.label }))]}
          />
        </div>
        <div className="flex flex-col gap-[0.3em]">
          <label className="text-[0.75em] text-cuarto/50 font-roboto">Prioridad</label>
          {estado && esEstadoFinal(estado) ? (
            <span className="w-full h-[2.5em] px-[0.75em] flex items-center rounded-[0.5em] text-[0.85em] text-cuarto/30 italic border border-transparent">
              No aplica
            </span>
          ) : (
            <Select
              value={prioridad}
              onChange={onPrioridadChange}
              placeholder="Sin prioridad"
              options={[{ value: '', label: 'Sin prioridad' }, ...prioridades.map((p) => ({ value: p.id, label: p.label }))]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-baseline gap-[0.5em]">
      <span className="text-[0.75em] text-cuarto/40 font-roboto w-[5.5em] flex-shrink-0">{label}:</span>
      <span className="text-[0.75em] text-cuarto/70 font-roboto truncate">{value}</span>
    </div>
  );
}

function DeliveryRow({ fecha }) {
  if (!fecha) {
    return (
      <div className="flex items-baseline gap-[0.5em]">
        <span className="text-[0.75em] text-cuarto/40 font-roboto w-[5.5em] flex-shrink-0">Entrega:</span>
        <span className="text-[0.75em] text-cuarto/30 font-roboto italic">Sin fecha</span>
      </div>
    );
  }
  return (
    <div className="flex items-baseline gap-[0.5em]">
      <span className="text-[0.75em] text-cuarto/40 font-roboto w-[5.5em] flex-shrink-0">Entrega:</span>
      <span className="text-[0.75em] font-roboto font-semibold text-segundo">{formatearFecha(fecha)}</span>
    </div>
  );
}

function IdRow({ diasMaximos }) {
  const codigo = diasMaximos !== null && diasMaximos !== undefined && diasMaximos !== ''
    ? `D${diasMaximos}DM`
    : null;
  return (
    <div className="flex items-baseline gap-[0.5em]">
      <span className="text-[0.75em] text-cuarto/40 font-roboto w-[5.5em] flex-shrink-0">ID:</span>
      {codigo ? (
        <span className="text-[0.75em] font-mono font-bold tracking-widest text-cuarto/50 select-all">{codigo}</span>
      ) : (
        <span className="text-[0.75em] text-cuarto/30 font-roboto italic">—</span>
      )}
    </div>
  );
}

export default CategoryCard;
