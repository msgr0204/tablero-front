import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const SIZES = {
  sm: 'max-w-[26em]',
  md: 'max-w-[30em]',
  lg: 'max-w-[38em]',
  xl: 'max-w-[46em]',
};

// Diálogo base de la app.
//
// `footer` va fuera del área que scrollea: en un formulario largo la botonera
// quedaba al final del contenido y había que bajar hasta el fondo para encontrar
// el botón de guardar. Anclada, la acción está siempre a la vista.
//
// `icon` y `eyebrow` son opcionales y arman la misma cabecera que usan las
// pantallas (pastilla con el ícono + rótulo tenue + título), para que abrir un
// modal no se sienta como entrar a otra aplicación.
function Modal({ isOpen, onClose, title, eyebrow, icon, children, footer, size = 'md' }) {
  const overlayRef = useRef(null);
  const reducirMovimiento = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'linear' }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-[1em] bg-primero-oscuro/70"
        >
          <motion.div
            initial={reducirMovimiento ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducirMovimiento ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reducirMovimiento ? 0.1 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={[
              'w-full relative',
              'bg-primero-fuerte border border-cuarto/10',
              'rounded-t-[1.25em] sm:rounded-[1.25em] shadow-xl shadow-primero-oscuro/50',
              'max-h-[90dvh] flex flex-col',
              SIZES[size],
            ].join(' ')}
          >
            <div className="flex items-center gap-[0.85em] px-[1.25em] sm:px-[1.5em] pt-[1.25em] pb-[1em] border-b border-cuarto/10 flex-shrink-0">
              {icon && (
                <span className="w-[2.5em] h-[2.5em] rounded-[0.75em] bg-segundo/10 border border-segundo/25 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={icon} className="text-segundo text-[0.9em]" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                {eyebrow && (
                  <p className="text-[0.65em] font-bold uppercase tracking-[0.12em] text-segundo/70 font-poppins">{eyebrow}</p>
                )}
                <h2 id="modal-title" className="text-[1em] font-semibold text-cuarto font-poppins tracking-tight truncate">
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="w-[2.5em] h-[2.5em] sm:w-[2em] sm:h-[2em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:text-cuarto hover:bg-cuarto/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 flex-shrink-0"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="px-[1.25em] sm:px-[1.5em] py-[1.25em] overflow-y-auto flex-1 min-h-0">
              {children}
            </div>

            {footer && (
              <div className="px-[1.25em] sm:px-[1.5em] py-[1em] border-t border-cuarto/10 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Modal;
