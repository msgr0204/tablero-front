import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';
import useDraft from '../../../hooks/useDraft';
import { formatearFechaHora } from '../../../lib/formatFecha';

function ObservationList({ observaciones = [], onAdd, onRemove, draftKey = 'obs_input', hideList = false, hideInput = false }) {
  const isTouch = useIsTouchDevice();
  const [texto, setTexto, clearDraft] = useDraft(draftKey, '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!texto.trim()) return setError('Escribe una observación.');
    setError('');
    setLoading(true);
    try {
      await onAdd(texto.trim());
      clearDraft();
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
        <div className="flex gap-[0.5em]">
          <textarea
            value={texto}
            onChange={(e) => { setTexto(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="Agregar observación... (Enter para guardar)"
            rows={2}
            aria-label="Nueva observación"
            className={[
              'flex-1 px-[0.85em] py-[0.6em] rounded-[0.5em] text-[0.875em] font-roboto resize-none',
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
            <li key={obs.id} className="flex gap-[0.75em] bg-primero-claro/40 border border-cuarto/10 rounded-[0.6em] px-[0.85em] py-[0.7em] group">
              <div className="flex-1 min-w-0">
                <p className="text-[0.85em] text-cuarto/80 font-roboto leading-snug">{obs.texto}</p>
                <p className="text-[0.75em] text-cuarto/30 font-roboto mt-[0.3em]">{formatearFechaHora(obs.fecha)}</p>
              </div>
              <button
                onClick={() => onRemove(obs.id)}
                aria-label="Eliminar observación"
                className={`${isTouch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'} text-quinto/40 hover:text-quinto-claro w-[2.25em] h-[2.25em] flex items-center justify-center transition-all duration-200 focus:outline-none flex-shrink-0`}
              >
                <FontAwesomeIcon icon={faTrash} className="text-[0.8em]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default ObservationList;
