import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft, faPowerOff, faBuilding, faUser, faUsers, faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';

// Sidebar principal estilo "Escritorios": overlay que se desliza desde la
// izquierda (Framer), agrupa la navegación entre tableros para descargar el
// header. Se monta desde AppHeader, así todas las páginas lo heredan.
function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { branding } = useBranding();
  const reducirMovimiento = useReducedMotion();

  const ir = (ruta) => { onClose(); navigate(ruta); };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/auth/login', { replace: true });
  };

  const nombreMarca = branding?.nombreMarca ?? 'Tareq';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Sin backdrop-blur: el desenfoque se recalcula en cada frame y es lo
              que hace pesado el deslizamiento en GPUs modestas. Un oscurecido
              plano se compone en la GPU sin coste por frame. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'linear' }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-primero-oscuro/70"
          />

          {/* Solo transform + opacity (compuestas por GPU). Framer gestiona el
              will-change durante la animación, así que no se declara a mano (si
              no, quedaría una capa reservada aun con el sidebar cerrado). Si el
              sistema pide reducir movimiento, aparece sin deslizamiento. */}
          <motion.aside
            initial={reducirMovimiento ? { opacity: 0 } : { x: '-100%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reducirMovimiento ? { opacity: 0 } : { x: '-100%', opacity: 0.6 }}
            transition={reducirMovimiento ? { duration: 0.12 } : { type: 'tween', duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 left-0 top-0 h-dvh w-[18em] max-w-[85vw] bg-primero-fuerte border-r border-cuarto/10 shadow-xl shadow-primero-oscuro/50 flex flex-col rounded-r-[1.5em] font-poppins"
            aria-label="Menú principal"
          >
            <div className="px-[1.25em] pt-[1.25em] pb-[1.25em] border-b border-cuarto/10">
              <div className="flex items-center justify-between gap-[0.75em]">
                <div className="flex items-center gap-[0.6em] min-w-0">
                  {branding?.logoUrl ? (
                    <img src={branding.logoUrl} alt={nombreMarca} className="h-[2.25em] w-auto max-w-[9em] object-contain" draggable={false} />
                  ) : (
                    <div className="h-[2.5em] w-[2.5em] rounded-[0.75em] bg-segundo/15 border border-segundo/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-segundo font-bold text-[0.9em]">{nombreMarca.slice(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar menú"
                  className="h-[2.25em] w-[2.25em] rounded-[0.6em] bg-cuarto/5 border border-cuarto/10 text-cuarto/60 hover:bg-segundo hover:text-primero-oscuro transition-all duration-200 flex items-center justify-center flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-[0.85em] py-[1em]">
              <ul className="flex flex-col gap-[0.4em]">
                <ItemSidebar icon={faBuilding} label="Tablero de empresa" onClick={() => ir('/tablero')} />
                <ItemSidebar icon={faUser} label="Mi tablero" onClick={() => ir('/tablero-personal')} />
                <ItemSidebar icon={faUsers} label="Tableros de equipo" onClick={() => ir('/equipos')} />
                <ItemSidebar icon={faClockRotateLeft} label="Auditoría" onClick={() => ir('/auditoria')} />
              </ul>
            </nav>

            <div className="p-[0.85em] border-t border-cuarto/10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full min-h-[2.75em] rounded-[0.85em] bg-quinto/10 border border-quinto/25 text-quinto-claro hover:bg-quinto hover:text-primero-oscuro transition-all duration-200 flex items-center justify-center gap-[0.5em] font-semibold text-[0.85em]"
              >
                <FontAwesomeIcon icon={faPowerOff} />
                Cerrar sesión
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ItemSidebar({ icon, label, onClick }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group w-full min-h-[3em] rounded-[0.85em] px-[0.75em] py-[0.5em] flex items-center gap-[0.75em] text-cuarto/80 hover:text-primero-oscuro hover:bg-segundo transition-all duration-200 focus:outline-none cursor-pointer"
      >
        <span className="h-[2.25em] w-[2.25em] shrink-0 rounded-[0.6em] bg-cuarto/5 border border-cuarto/10 text-segundo flex items-center justify-center group-hover:bg-primero-oscuro/10 group-hover:text-primero-oscuro transition">
          <FontAwesomeIcon icon={icon} />
        </span>
        <span className="text-[0.85em] font-semibold flex-1 text-left">{label}</span>
      </button>
    </li>
  );
}

export default Sidebar;
