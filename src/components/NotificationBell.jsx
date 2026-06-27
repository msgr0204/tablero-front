import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import useNotificaciones from '../hooks/useNotificaciones';
import NotificationDetailModal from './NotificationDetailModal';
import NotificationHistoryModal from './NotificationHistoryModal';
import { iconoEntidad, tiempoRelativo } from '../lib/notificacionFormato';

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [detalleAbierto, setDetalleAbierto] = useState(null);
  const [historialAbierto, setHistorialAbierto] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const {
    notificaciones, noLeidas, loading,
    historial, pagina, totalPaginas, loadingHistorial,
    fetchNoLeidas, fetchNotificaciones, fetchHistorial, marcarLeida,
  } = useNotificaciones();

  useEffect(() => {
    fetchNoLeidas();
  }, [fetchNoLeidas]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (buttonRef.current?.contains(e.target)) return;
      if (dropdownRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('touchstart', handleClick);
    }, 0);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [open]);

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
      fetchNotificaciones();
    }
    setOpen((p) => !p);
  };

  const handleAbrirDetalle = (notificacion) => {
    setOpen(false);
    setHistorialAbierto(false);
    setDetalleAbierto(notificacion);
  };

  const handleVerTodas = () => {
    setOpen(false);
    setHistorialAbierto(true);
  };

  const handleCambiarPagina = useCallback((nuevaPagina) => {
    fetchHistorial(nuevaPagina);
  }, [fetchHistorial]);

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-label="Notificaciones"
        aria-expanded={open}
        className="relative flex items-center justify-center w-[2.25em] h-[2.25em] rounded-[0.5em] text-cuarto/60 hover:text-segundo hover:bg-cuarto/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
      >
        <FontAwesomeIcon icon={faBell} className="text-[0.95em]" />
        {noLeidas > 0 && (
          <span className="absolute top-[0.1em] right-[0.1em] min-w-[1.1em] h-[1.1em] px-[0.2em] flex items-center justify-center rounded-full bg-quinto text-[0.6em] font-bold font-poppins text-cuarto leading-none">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          style={{ top: dropdownPos.top, right: dropdownPos.right, zIndex: 99999, position: 'fixed' }}
          className="w-[22em] max-w-[90vw] bg-primero-fuerte border border-cuarto/10 rounded-[0.75em] shadow-2xl shadow-primero-oscuro/80 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-[1em] py-[0.75em] border-b border-cuarto/10 flex-shrink-0">
            <p className="text-[0.875em] font-semibold text-cuarto font-poppins">Notificaciones</p>
            <button
              onClick={handleVerTodas}
              className="text-[0.75em] text-segundo/70 hover:text-segundo transition-colors duration-200 font-roboto underline"
            >
              Ver todas
            </button>
          </div>

          <div className="max-h-[24em] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-[2.5em]">
                <div className="w-[1.25em] h-[1.25em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
              </div>
            ) : notificaciones.length === 0 ? (
              <p className="text-[0.8em] text-cuarto/30 font-roboto italic text-center py-[2.5em]">
                Sin notificaciones
              </p>
            ) : (
              notificaciones.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleAbrirDetalle(n)}
                  className={[
                    'w-full flex items-start gap-[0.65em] px-[1em] py-[0.85em] text-left border-b border-cuarto/5 transition-colors duration-200',
                    n.leida ? 'opacity-50' : 'hover:bg-segundo/5',
                  ].join(' ')}
                >
                  <div className={`w-[1.75em] h-[1.75em] rounded-[0.5em] flex items-center justify-center flex-shrink-0 ${n.leida ? 'bg-cuarto/5' : 'bg-segundo/10'}`}>
                    <FontAwesomeIcon
                      icon={iconoEntidad(n.entidad)}
                      className={`text-[0.75em] ${n.leida ? 'text-cuarto/30' : 'text-segundo'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.8em] text-cuarto/85 font-roboto leading-snug">{n.mensaje}</p>
                    <p className="text-[0.7em] text-cuarto/35 font-roboto mt-[0.2em]">{tiempoRelativo(n.created_at)}</p>
                  </div>
                  {!n.leida && (
                    <span className="w-[0.5em] h-[0.5em] rounded-full bg-segundo flex-shrink-0 mt-[0.3em]" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}

      <NotificationDetailModal
        notificacion={detalleAbierto}
        isOpen={!!detalleAbierto}
        onClose={() => setDetalleAbierto(null)}
        onMarcarLeida={(id) => {
          marcarLeida(id);
          setDetalleAbierto((prev) => (prev ? { ...prev, leida: true } : prev));
        }}
      />

      <NotificationHistoryModal
        isOpen={historialAbierto}
        onClose={() => setHistorialAbierto(false)}
        onSelect={handleAbrirDetalle}
        historial={historial}
        pagina={pagina}
        totalPaginas={totalPaginas}
        loading={loadingHistorial}
        onCambiarPagina={handleCambiarPagina}
      />
    </div>
  );
}

export default NotificationBell;
