import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faImage, faXmark, faSpinner, faPaste } from '@fortawesome/free-solid-svg-icons';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';

const MAXIMO_ADJUNTOS = 3;
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024;

// Un screenshot del portapapeles llega sin nombre; se le pone uno con marca de
// tiempo para que en el almacenamiento no queden varios "image.png" indistinguibles.
function nombrarPegado(tipo) {
  const extension = tipo.split('/')[1] ?? 'png';
  const sello = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  return `captura-${sello}.${extension}`;
}

function RequirementAttachments({ adjuntos = [], onAdd, onRemove }) {
  const isTouch = useIsTouchDevice();
  const inputRef = useRef(null);
  const zonaRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [error, setError] = useState('');
  const [ampliada, setAmpliada] = useState(null);
  // Una imagen borrada no se recupera desde la interfaz: se confirma antes.
  const [porEliminar, setPorEliminar] = useState(null);

  const puedeAgregar = adjuntos.length < MAXIMO_ADJUNTOS;

  const subir = useCallback(async (archivo) => {
    setError('');
    setSubiendo(true);
    try {
      await onAdd(archivo);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setSubiendo(false);
    }
  }, [onAdd]);

  const handleSeleccionar = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    await subir(archivo);
  };

  // Pegar una captura con Ctrl+V es el camino natural para adjuntar evidencia:
  // el flujo habitual es recortar la pantalla y traerla aquí, y obligar a
  // guardar el archivo antes de subirlo añade un paso que nadie quiere dar.
  //
  // El listener va en el documento y no en un input porque el área de imágenes
  // no tiene ningún campo donde escribir, así que nunca recibiría el foco. Para
  // no robarle el pegado a quien está escribiendo un requerimiento o una
  // observación, se ignora el evento cuando viene de un campo de texto.
  useEffect(() => {
    if (!puedeAgregar || subiendo) return;

    const alPegar = (evento) => {
      const origen = evento.target;
      const escribiendo = origen?.isContentEditable
        || ['INPUT', 'TEXTAREA', 'SELECT'].includes(origen?.tagName);
      if (escribiendo) return;

      const imagen = [...(evento.clipboardData?.items ?? [])]
        .find((item) => item.kind === 'file' && item.type.startsWith('image/'));
      if (!imagen) return;

      evento.preventDefault();
      const archivo = imagen.getAsFile();
      if (!archivo) return;

      // Se valida aquí lo mismo que exige el servidor: un aviso inmediato es más
      // útil que un 400 después de subir cinco megas.
      if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
        setError('Solo se permiten imágenes JPG, PNG o WEBP');
        return;
      }
      if (archivo.size > TAMANO_MAXIMO_BYTES) {
        setError('La imagen supera el máximo de 5 MB');
        return;
      }

      subir(new File([archivo], nombrarPegado(archivo.type), { type: archivo.type }));
    };

    document.addEventListener('paste', alPegar);
    return () => document.removeEventListener('paste', alPegar);
  }, [puedeAgregar, subiendo, subir]);

  const handleEliminar = async () => {
    const adjuntoId = porEliminar;
    setEliminandoId(adjuntoId);
    try {
      await onRemove(adjuntoId);
      setPorEliminar(null);
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div ref={zonaRef} className="flex flex-col gap-[0.6em]">
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
        <div className="flex flex-col items-center justify-center gap-[0.4em] py-[1.25em] border border-dashed border-cuarto/15 rounded-[0.5em]">
          <div className="flex items-center gap-[0.5em]">
            <FontAwesomeIcon icon={faImage} className="text-cuarto/15 text-[0.95em]" />
            <p className="text-[0.8em] text-cuarto/25 font-roboto italic">Sin imágenes aún</p>
          </div>
          {puedeAgregar && !isTouch && <PistaPegar />}
        </div>
      ) : (
        <>
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
                  onClick={() => setPorEliminar(adjunto.id)}
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
          {puedeAgregar && !isTouch && <PistaPegar />}
        </>
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

      <ConfirmDeleteModal
        isOpen={Boolean(porEliminar)}
        confirming={Boolean(eliminandoId)}
        label="esta imagen"
        onCancel={() => setPorEliminar(null)}
        onConfirm={handleEliminar}
      />
    </div>
  );
}

// El atajo no se descubre solo: sin decirlo, nadie intenta pegar en una zona que
// no parece un campo de texto.
function PistaPegar() {
  return (
    <p className="flex items-center justify-center gap-[0.4em] text-[0.7em] text-cuarto/25 font-roboto">
      <FontAwesomeIcon icon={faPaste} className="text-[0.85em]" />
      o pega una captura con
      <kbd className="px-[0.4em] py-[0.05em] rounded-[0.3em] border border-cuarto/15 bg-cuarto/5 font-mono text-[0.9em] text-cuarto/40">Ctrl+V</kbd>
    </p>
  );
}

export default RequirementAttachments;
