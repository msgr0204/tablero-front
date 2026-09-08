import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCommentDots, faPen, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';
import useDraft from '../../../hooks/useDraft';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import usePermisosTablero from '../hooks/usePermisosTablero';
import { formatearFechaHora } from '../../../lib/formatFecha';

// Crece con el contenido (de 2 líneas hasta ~10), sin dejar de tener scroll
// interno si el texto se pasa. Así un texto largo se ve cómodo al escribirlo.
function ajustarAlto(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
}

function ObservationItem({ obs, onRemove, onEdit }) {
  // Editar una observación ajena no lo permite nadie —reescribir lo que otro
  // dijo falsea el registro—; borrarla queda para su autor o un administrador.
  const { puedeEditarObservacion, puedeEliminarObservacion } = usePermisosTablero();
  const puedeEditar = puedeEditarObservacion(obs);
  const puedeEliminar = puedeEliminarObservacion(obs);
  const isTouch = useIsTouchDevice();
  const [editing, setEditing] = useState(false);
  const [texto, setTexto] = useState(obs.texto);
  const [saving, setSaving] = useState(false);
  // Borrar una observación es irreversible desde la interfaz: se confirma, como
  // el resto de eliminaciones del tablero.
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const confirmarEliminar = async () => {
    setEliminando(true);
    try {
      await onRemove(obs.id);
      setConfirmando(false);
    } finally {
      setEliminando(false);
    }
  };
  const areaRef = useRef(null);

  const isDirty = texto.trim() !== obs.texto;

  useEffect(() => {
    if (editing) ajustarAlto(areaRef.current);
  }, [editing]);

  const empezarEdicion = () => {
    setTexto(obs.texto);
    setEditing(true);
  };

  const guardar = async () => {
    if (!texto.trim()) return;
    if (!isDirty) { setEditing(false); return; }
    setSaving(true);
    try {
      await onEdit(obs.id, texto.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); guardar(); }
    if (e.key === 'Escape') { setEditing(false); }
  };

  if (editing) {
    return (
      <li className="flex flex-col gap-[0.5em] bg-primero-claro/60 border border-segundo/60 rounded-[0.6em] px-[0.85em] py-[0.7em] focus-within:ring-1 focus-within:ring-segundo/40">
        <textarea
          ref={areaRef}
          value={texto}
          onChange={(e) => { setTexto(e.target.value); ajustarAlto(e.target); }}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={2}
          className="w-full text-[0.85em] font-roboto resize-none bg-transparent text-cuarto border-none outline-none leading-snug p-0"
        />
        <div className="flex items-center justify-end gap-[0.4em]">
          <button
            onClick={() => setEditing(false)}
            disabled={saving}
            aria-label="Cancelar edición"
            className="w-[2em] h-[2em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:bg-cuarto/10 transition-all duration-200 focus:outline-none"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[0.8em]" />
          </button>
          <button
            onClick={guardar}
            disabled={saving || !texto.trim()}
            aria-label="Guardar observación"
            className="w-[2em] h-[2em] flex items-center justify-center rounded-[0.5em] bg-segundo/10 border border-segundo/30 text-segundo hover:bg-segundo/20 disabled:opacity-40 transition-all duration-200 focus:outline-none"
          >
            {saving
              ? <div className="w-[0.75em] h-[0.75em] border border-segundo/40 border-t-segundo rounded-full animate-spin" />
              : <FontAwesomeIcon icon={faCheck} className="text-[0.8em]" />
            }
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex gap-[0.75em] bg-primero-claro/40 border border-cuarto/10 rounded-[0.6em] px-[0.85em] py-[0.7em] group">
      <div className="flex-1 min-w-0">
        <p className="text-[0.85em] text-cuarto/80 font-roboto leading-snug whitespace-pre-wrap break-words">{obs.texto}</p>
        <p className="text-[0.75em] text-cuarto/30 font-roboto mt-[0.3em]">{formatearFechaHora(obs.fecha)}</p>
      </div>
      <div className={`flex items-start gap-[0.1em] flex-shrink-0 ${isTouch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'} transition-opacity duration-200`}>
        {onEdit && puedeEditar && (
          <button
            onClick={empezarEdicion}
            aria-label="Editar observación"
            className="text-cuarto/40 hover:text-segundo w-[2em] h-[2em] flex items-center justify-center transition-all duration-200 focus:outline-none"
          >
            <FontAwesomeIcon icon={faPen} className="text-[0.75em]" />
          </button>
        )}
        {puedeEliminar && (
        <button
          onClick={() => setConfirmando(true)}
          aria-label="Eliminar observación"
          className="text-quinto/40 hover:text-quinto-claro w-[2em] h-[2em] flex items-center justify-center transition-all duration-200 focus:outline-none"
        >
          <FontAwesomeIcon icon={faTrash} className="text-[0.75em]" />
        </button>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={confirmando}
        confirming={eliminando}
        label="esta observación"
        onCancel={() => setConfirmando(false)}
        onConfirm={confirmarEliminar}
      />
    </li>
  );
}

function ObservationList({ observaciones = [], onAdd, onRemove, onEdit, draftKey = 'obs_input', hideList = false, hideInput = false }) {
  const [texto, setTexto, clearDraft] = useDraft(draftKey, '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const areaRef = useRef(null);

  const handleAdd = async () => {
    if (!texto.trim()) return setError('Escribe una observación.');
    setError('');
    setLoading(true);
    try {
      await onAdd(texto.trim());
      clearDraft();
      ajustarAlto(areaRef.current);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(); }
  };

  return (
    <div className="flex flex-col gap-[0.85em]">
      {!hideInput && (
        <div className="flex gap-[0.5em] items-start">
          <textarea
            ref={areaRef}
            value={texto}
            onChange={(e) => { setTexto(e.target.value); setError(''); ajustarAlto(e.target); }}
            onKeyDown={handleKeyDown}
            placeholder="Agregar observación... (Enter para guardar, Shift+Enter para salto de línea)"
            rows={2}
            aria-label="Nueva observación"
            className={[
              'flex-1 px-[0.85em] py-[0.6em] rounded-[0.5em] text-[0.875em] font-roboto resize-none leading-snug',
              'bg-primero-claro/60 text-cuarto placeholder:text-cuarto/30',
              'border transition-all duration-200 outline-none',
              'focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40',
              error ? 'border-quinto/50' : 'border-cuarto/10 hover:border-cuarto/20',
            ].join(' ')}
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            aria-label="Agregar observación"
            className="w-[2.5em] h-[2.5em] mt-[0.1em] flex items-center justify-center rounded-[0.5em] bg-segundo/10 border border-segundo/30 text-segundo hover:bg-segundo/20 transition-all duration-200 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 flex-shrink-0"
          >
            {loading
              ? <div className="w-[0.9em] h-[0.9em] border border-segundo/40 border-t-segundo rounded-full animate-spin" />
              : <FontAwesomeIcon icon={faPlus} className="text-[0.8em]" />
            }
          </button>
        </div>
      )}

      {error && <p className="text-[0.8em] text-quinto-claro -mt-[0.5em]">{error}</p>}

      {hideList ? null : observaciones.length === 0 ? (
        <div className="flex items-center justify-center gap-[0.5em] py-[1.5em] border border-dashed border-cuarto/15 rounded-[0.5em]">
          <FontAwesomeIcon icon={faCommentDots} className="text-cuarto/15 text-[0.95em]" />
          <p className="text-[0.8em] text-cuarto/25 font-roboto italic">Sin observaciones aún</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-[0.6em]">
          {observaciones.map((obs) => (
            <ObservationItem key={obs.id} obs={obs} onRemove={onRemove} onEdit={onEdit} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default ObservationList;
