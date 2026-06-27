import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
}) {
  useEffect(() => {
    if (isOpen) onCambiarPagina(1);
  }, [isOpen, onCambiarPagina]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Historial de notificaciones" size="lg">
      <div className="flex flex-col gap-[0.6em]">
        {loading ? (
          <div className="flex items-center justify-center py-[3em]">
            <div className="w-[1.25em] h-[1.25em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
          </div>
        ) : historial.length === 0 ? (
          <p className="text-[0.85em] text-cuarto/30 font-roboto italic text-center py-[3em]">
            Sin notificaciones
          </p>
        ) : (
          historial.map((n) => (
            <button
              key={n.id}
              onClick={() => onSelect(n)}
              className="w-full flex items-start gap-[0.75em] px-[1em] py-[0.85em] rounded-[0.6em] border border-cuarto/10 hover:border-segundo/30 hover:bg-segundo/5 text-left transition-all duration-200"
            >
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
            </button>
          ))
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
