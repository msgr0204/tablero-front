import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCheckDouble, faListCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import { iconoEntidad } from '../lib/notificacionFormato';

function formatFecha(fecha) {
  return new Date(fecha).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function NotificationHistoryModal({
  isOpen, onClose, onSelect,
  historial, pagina, totalPaginas, loading, onCambiarPagina,
  onMarcarVarias, onMarcarTodas, hayNoLeidas,
}) {
  const [seleccionando, setSeleccionando] = useState(false);
  const [seleccion, setSeleccion] = useState(() => new Set());
  const [aplicando, setAplicando] = useState(false);

  useEffect(() => {
    if (isOpen) onCambiarPagina(1);
  }, [isOpen, onCambiarPagina]);

  // Al cerrar el modal o cambiar de página, la selección deja de tener sentido.
  useEffect(() => {
    setSeleccion(new Set());
    setSeleccionando(false);
  }, [isOpen, pagina]);

  const toggleSeleccion = (id) => {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const salirSeleccion = () => {
    setSeleccionando(false);
    setSeleccion(new Set());
  };

  const handleMarcarSeleccionadas = async () => {
    if (seleccion.size === 0) return;
    setAplicando(true);
    try {
      await onMarcarVarias([...seleccion]);
      salirSeleccion();
    } finally {
      setAplicando(false);
    }
  };

  const handleMarcarTodas = async () => {
    setAplicando(true);
    try {
      await onMarcarTodas();
      salirSeleccion();
    } finally {
      setAplicando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Historial de notificaciones" size="lg">
      <div className="flex flex-col gap-[0.6em]">
        {!loading && historial.length > 0 && (
          <div className="flex items-center gap-[0.5em] flex-wrap pb-[0.6em] border-b border-cuarto/10">
            {seleccionando ? (
              <>
                <span className="text-[0.8em] text-cuarto/60 font-roboto">
                  {seleccion.size} seleccionada{seleccion.size === 1 ? '' : 's'}
                </span>
                <button
                  type="button"
                  onClick={handleMarcarSeleccionadas}
                  disabled={seleccion.size === 0 || aplicando}
                  className="ml-auto flex items-center gap-[0.4em] px-[0.7em] h-[2em] rounded-[0.5em] text-[0.75em] font-semibold font-poppins bg-segundo/10 border border-segundo/25 text-segundo hover:bg-segundo/20 disabled:opacity-40 transition-all duration-200 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faCheckDouble} className="text-[0.75em]" />
                  Marcar como leídas
                </button>
                <button
                  type="button"
                  onClick={salirSeleccion}
                  aria-label="Cancelar selección"
                  className="flex items-center gap-[0.4em] px-[0.7em] h-[2em] rounded-[0.5em] text-[0.75em] font-medium font-poppins text-cuarto/50 hover:text-cuarto hover:bg-cuarto/10 transition-all duration-200 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-[0.75em]" />
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setSeleccionando(true)}
                  className="flex items-center gap-[0.4em] px-[0.7em] h-[2em] rounded-[0.5em] text-[0.75em] font-medium font-poppins text-cuarto/60 border border-cuarto/10 hover:text-segundo hover:border-segundo/30 transition-all duration-200 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faListCheck} className="text-[0.75em]" />
                  Seleccionar
                </button>
                {hayNoLeidas && (
                  <button
                    type="button"
                    onClick={handleMarcarTodas}
                    disabled={aplicando}
                    className="ml-auto flex items-center gap-[0.4em] px-[0.7em] h-[2em] rounded-[0.5em] text-[0.75em] font-medium font-poppins text-segundo/80 hover:text-segundo hover:bg-segundo/10 disabled:opacity-40 transition-all duration-200 focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faCheckDouble} className="text-[0.75em]" />
                    Marcar todas como leídas
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-[3em]">
            <div className="w-[1.25em] h-[1.25em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
          </div>
        ) : historial.length === 0 ? (
          <p className="text-[0.85em] text-cuarto/30 font-roboto italic text-center py-[3em]">
            Sin notificaciones
          </p>
        ) : (
          historial.map((n) => {
            const contenido = (
              <>
                <div className={`w-[1.85em] h-[1.85em] rounded-[0.5em] flex items-center justify-center flex-shrink-0 ${n.leida ? 'bg-cuarto/5' : 'bg-segundo/10'}`}>
                  <FontAwesomeIcon
                    icon={iconoEntidad(n.entidad)}
                    className={`text-[0.8em] ${n.leida ? 'text-cuarto/30' : 'text-segundo'}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.85em] text-cuarto/85 font-roboto leading-snug">{n.mensaje}</p>
                  <p className="text-[0.7em] text-cuarto/35 font-roboto mt-[0.25em]">{formatFecha(n.created_at)}</p>
                </div>
                <span
                  className={[
                    'text-[0.7em] font-poppins font-medium rounded-full px-[0.7em] py-[0.25em] flex-shrink-0',
                    n.leida ? 'bg-cuarto/5 text-cuarto/40' : 'bg-segundo/15 text-segundo',
                  ].join(' ')}
                >
                  {n.leida ? 'Leída' : 'No leída'}
                </span>
              </>
            );

            if (seleccionando) {
              return (
                <label
                  key={n.id}
                  className="w-full flex items-center gap-[0.75em] px-[1em] py-[0.85em] rounded-[0.6em] border border-cuarto/10 hover:border-segundo/30 cursor-pointer transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    checked={seleccion.has(n.id)}
                    onChange={() => toggleSeleccion(n.id)}
                    className="accent-segundo w-[1.1em] h-[1.1em] flex-shrink-0"
                  />
                  {contenido}
                </label>
              );
            }

            return (
              <button
                key={n.id}
                onClick={() => onSelect(n)}
                className="w-full flex items-start gap-[0.75em] px-[1em] py-[0.85em] rounded-[0.6em] border border-cuarto/10 hover:border-segundo/30 hover:bg-segundo/5 text-left transition-all duration-200"
              >
                {contenido}
              </button>
            );
          })
        )}

        {!loading && historial.length > 0 && (
          <div className="flex items-center justify-between pt-[0.75em] border-t border-cuarto/10">
            <span className="text-[0.8em] text-cuarto/40 font-roboto">
              Página {pagina} de {totalPaginas}
            </span>
            <div className="flex items-center gap-[0.5em]">
              <button
                type="button"
                onClick={() => onCambiarPagina(pagina - 1)}
                disabled={pagina <= 1}
                className="flex items-center gap-[0.4em] text-[0.8em] font-roboto text-cuarto/70 hover:text-segundo disabled:opacity-30 disabled:hover:text-cuarto/70 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-[0.75em]" />
                Anterior
              </button>
              <button
                type="button"
                onClick={() => onCambiarPagina(pagina + 1)}
                disabled={pagina >= totalPaginas}
                className="flex items-center gap-[0.4em] text-[0.8em] font-roboto text-cuarto/70 hover:text-segundo disabled:opacity-30 disabled:hover:text-cuarto/70 transition-colors"
              >
                Siguiente
                <FontAwesomeIcon icon={faChevronRight} className="text-[0.75em]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default NotificationHistoryModal;
