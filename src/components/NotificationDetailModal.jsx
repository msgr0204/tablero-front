import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import resolverRutaNotificacion, { etiquetaEntidad } from '../lib/resolverRutaNotificacion';
import { iconoEntidad } from '../lib/notificacionFormato';

function formatFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function NotificationDetailModal({ notificacion, isOpen, onClose, onMarcarLeida }) {
  const navigate = useNavigate();
  if (!notificacion) return null;

  const ruta = resolverRutaNotificacion(notificacion);

  const handleToggleLeida = () => {
    if (!notificacion.leida) onMarcarLeida(notificacion.id);
  };

  const handleNavegar = () => {
    onClose();
    navigate(ruta);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notificación" size="md">
      <div className="flex flex-col gap-[1.25em]">
        <div className="flex items-center gap-[0.75em]">
          <div className="w-[2.5em] h-[2.5em] rounded-[0.65em] flex items-center justify-center flex-shrink-0 bg-segundo/10">
            <FontAwesomeIcon icon={iconoEntidad(notificacion.entidad)} className="text-[1em] text-segundo" />
          </div>
          <div className="flex flex-col gap-[0.15em] min-w-0">
            <span className="text-[0.8em] font-semibold text-cuarto font-poppins">
              {etiquetaEntidad(notificacion.entidad)}
            </span>
            <span className="text-[0.75em] text-cuarto/40 font-roboto">
              {formatFecha(notificacion.created_at)}
            </span>
          </div>
        </div>

        <p className="text-[0.95em] text-cuarto/90 font-roboto leading-relaxed">
          {notificacion.mensaje}
        </p>

        {ruta ? (
          <button
            type="button"
            onClick={handleNavegar}
            className="flex items-center gap-[0.5em] text-[0.875em] text-segundo hover:text-segundo-claro font-roboto font-medium transition-colors w-fit"
          >
            Ver {etiquetaEntidad(notificacion.entidad).toLowerCase()}
            <FontAwesomeIcon icon={faArrowRight} className="text-[0.8em]" />
          </button>
        ) : (
          <p className="text-[0.8em] text-cuarto/30 font-roboto italic">
            Este elemento ya no existe.
          </p>
        )}

        <div className="flex items-center justify-between pt-[1em] border-t border-cuarto/10">
          <label className="flex items-center gap-[0.6em] text-[0.85em] text-cuarto/70 font-roboto cursor-pointer select-none">
            <input
              type="checkbox"
              checked={notificacion.leida}
              onChange={handleToggleLeida}
              disabled={notificacion.leida}
              className="accent-segundo w-[1.1em] h-[1.1em]"
            />
            Marcar como leída
          </label>

          <button
            type="button"
            onClick={onClose}
            className="text-[0.875em] font-poppins font-semibold text-cuarto hover:text-segundo transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default NotificationDetailModal;
