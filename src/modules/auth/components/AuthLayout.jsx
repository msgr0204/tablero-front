import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AuthCarousel from './AuthCarousel';

const pageVariants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
};

/**
 * Layout persistente: se monta una sola vez para /auth/login y /auth/register
 * (ver rutas anidadas en App.jsx). Así la card no se desmonta al alternar
 * entre los dos formularios; AnimatePresence anima solo el contenido interno
 * (vía <Outlet>, usando la ruta como key) para una transición de salida +
 * entrada fluida, en vez del "flash" de remontar todo el layout.
 */
function AuthLayout() {
  const location = useLocation();

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-primero-oscuro p-[1em] font-roboto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-[58em] min-h-[34em] rounded-[1.75em] bg-primero-fuerte border border-cuarto/5 shadow-[0_2em_5em_-1em_rgba(0,0,0,0.6)] overflow-hidden"
      >
        <AuthCarousel />
        <div className="flex-1 flex items-center justify-center p-[2em] sm:p-[3em] overflow-hidden">
          <div className="w-full max-w-[24em]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;
