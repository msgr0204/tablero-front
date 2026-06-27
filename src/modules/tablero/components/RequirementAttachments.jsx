import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faImage, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';

const MAXIMO_ADJUNTOS = 3;

function RequirementAttachments({ adjuntos = [], onAdd, onRemove }) {
  const isTouch = useIsTouchDevice();
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [error, setError] = useState('');
  const [ampliada, setAmpliada] = useState(null);

  const handleSeleccionar = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;

    setError('');
    setSubiendo(true);
    try {
      await onAdd(archivo);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminar = async (adjuntoId) => {
    setEliminandoId(adjuntoId);
    try {
      await onRemove(adjuntoId);
    } finally {
      setEliminandoId(null);
    }
  };

  const puedeAgregar = adjuntos.length < MAXIMO_ADJUNTOS;

  return (
    <div className="flex flex-col gap-[0.6em]">
      <div className="flex items-center justify-between">
        <p className="text-[0.75em] font-semibold text-cuarto/40 font-poppins uppercase tracking-wider">
          Imágenes ({adjuntos.length}/{MAXIMO_ADJUNTOS})
        </p>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleSeleccionar} className="hidden" />
        {puedeAgregar && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
            className="flex items-center gap-[0.4em] text-[0.75em] text-segundo hover:text-segundo-claro font-roboto font-medium disabled:opacity-50 transition-colors"
          >
            <FontAwesomeIcon icon={subiendo ? faSpinner : faPlus} spin={subiendo} className="text-[0.8em]" />
            {subiendo ? 'Subiendo...' : 'Agregar'}
          </button>
        )}
      </div>

      {error && <p className="text-[0.8em] text-quinto-claro">{error}</p>}

      {adjuntos.length === 0 ? (
        <div className="flex items-center justify-center gap-[0.5em] py-[1.25em] border border-dashed border-cuarto/15 rounded-[0.5em]">
          <FontAwesomeIcon icon={faImage} className="text-cuarto/15 text-[0.95em]" />
          <p className="text-[0.8em] text-cuarto/25 font-roboto italic">Sin imágenes aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[0.6em]">
          {adjuntos.map((adjunto) => (
            <div key={adjunto.id} className="relative group aspect-square rounded-[0.5em] overflow-hidden border border-cuarto/10 bg-primero-claro/40">
              <button
                type="button"
                onClick={() => setAmpliada(adjunto)}
                className="absolute inset-0 w-full h-full"
                aria-label="Ampliar imagen"
              >
                <img src={adjunto.url} alt="Adjunto del requerimiento" className="w-full h-full object-cover" draggable={false} />
              </button>
              <button
                type="button"
                onClick={() => handleEliminar(adjunto.id)}
                disabled={eliminandoId === adjunto.id}
                aria-label="Eliminar imagen"
                className={`${isTouch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'} absolute top-[0.3em] right-[0.3em] w-[1.75em] h-[1.75em] flex items-center justify-center rounded-[0.4em] bg-primero-oscuro/80 text-cuarto/70 hover:text-quinto-claro transition-all duration-200 focus:outline-none disabled:opacity-50`}
              >
                {eliminandoId === adjunto.id
                  ? <div className="w-[0.75em] h-[0.75em] border border-cuarto/40 border-t-cuarto rounded-full animate-spin" />
                  : <FontAwesomeIcon icon={faTrash} className="text-[0.7em]" />
                }
              </button>
            </div>
          ))}
        </div>
      )}

      {ampliada && createPortal(
        <div
          onClick={() => setAmpliada(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-[1.5em] bg-primero-oscuro/90 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setAmpliada(null)}
            aria-label="Cerrar"
            className="absolute top-[1em] right-[1em] w-[2.5em] h-[2.5em] flex items-center justify-center rounded-[0.5em] text-cuarto/70 hover:text-cuarto hover:bg-cuarto/10 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <img
            src={ampliada.url}
            alt="Adjunto ampliado"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded-[0.5em]"
          />
        </div>,
        document.body
      )}
    </div>
  );
}

export default RequirementAttachments;
