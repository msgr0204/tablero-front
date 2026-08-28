import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';
import Sidebar from './Sidebar';

function AppHeader({ logoUrl, nombreMarca = 'Tablero de Requerimientos', children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cuarto/10 bg-primero-claro/90 backdrop-blur-sm px-[1em] sm:px-[1.5em] py-[0.6em] sm:py-[0.75em] flex items-center gap-[0.75em]">
        <div className="flex items-center gap-[0.5em] sm:gap-[0.75em] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            className="w-[2.25em] h-[2.25em] flex items-center justify-center rounded-[0.5em] text-cuarto/60 hover:text-segundo hover:bg-cuarto/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
          >
            <FontAwesomeIcon icon={faBars} className="text-[1.15em]" />
          </button>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={nombreMarca}
              className="w-auto max-w-[13em] object-contain select-none h-[1.75em] sm:h-[2em]"
              draggable={false}
            />
          ) : (
            <span className="text-cuarto font-poppins font-semibold text-[0.9em] sm:text-[1em] truncate max-w-[40vw]">
              {nombreMarca}
            </span>
          )}
          <div className="w-px h-[1.5em] bg-cuarto/15 flex-shrink-0 hidden sm:block" />
        </div>

        <div className="flex-1 flex items-center justify-between gap-[0.75em] min-w-0">
          {children}
        </div>

        <div className="flex items-center gap-[0.6em] flex-shrink-0">
          <NotificationBell />
          <UserMenu />
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

export default AppHeader;
