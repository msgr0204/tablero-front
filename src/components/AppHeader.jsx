import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';

function AppHeader({ logoUrl, nombreMarca = 'Tablero de Requerimientos', children }) {
  return (
    <header className="sticky top-0 z-40 border-b border-cuarto/10 bg-primero-claro/90 backdrop-blur-sm px-[1em] sm:px-[1.5em] py-[0.6em] sm:py-[0.75em] flex items-center gap-[0.75em]">
      <div className="flex items-center gap-[0.75em] sm:gap-[1em] flex-shrink-0">
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
        <div className="w-px h-[1.5em] bg-cuarto/15 flex-shrink-0" />
      </div>

      <div className="flex-1 flex items-center justify-between gap-[0.75em] min-w-0">
        {children}
      </div>

      <div className="flex items-center gap-[0.4em] flex-shrink-0">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}

export default AppHeader;
