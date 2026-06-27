import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faChevronDown,
  faChevronRight,
  faUserPlus,
  faSliders,
  faPalette,
  faUser,
  faChartLine,
  faGaugeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

function obtenerIniciales(nombre) {
  if (!nombre) return 'US';
  const partes = nombre.trim().split(/\s+/);
  const iniciales = partes.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return iniciales.join('') || 'US';
}

const ROL_LABEL = { admin: 'Administrador', miembro: 'Miembro' };

function UserMenu() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);

  const nombre = usuario?.nombre ?? 'Usuario';
  const iniciales = obtenerIniciales(usuario?.nombre);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) setOpen(false);
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
    }
    setOpen((p) => !p);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/auth/login', { replace: true });
  };

  const handleNavigate = (ruta) => {
    setOpen(false);
    navigate(ruta);
  };

  const esAdmin = usuario?.rol === 'admin';

  const acciones = [
    { icon: faUserPlus, label: 'Gestión de usuarios', ruta: '/tablero/usuarios', disabled: !esAdmin },
    { icon: faChartLine, label: 'Dashboard ejecutivo', ruta: '/tablero/dashboard' },
    { icon: faGaugeHigh, label: 'Métricas', ruta: '/tablero/metricas' },
    { icon: faSliders, label: 'Estados y prioridades', ruta: '/tablero/configuracion-estados' },
    { icon: faPalette, label: 'Plantillas de marca', ruta: '/auth/seleccionar-plantilla' },
  ];

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-label="Menú de usuario"
        aria-expanded={open}
        className="flex items-center gap-[0.5em] h-[2.25em] px-[0.5em] rounded-[0.5em] hover:bg-cuarto/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
      >
        <div className="w-[2em] h-[2em] rounded-full bg-segundo/20 border border-segundo/40 flex items-center justify-center flex-shrink-0">
          <span className="text-[0.75em] font-bold font-poppins text-segundo">{iniciales}</span>
        </div>
        <span className="text-[0.8em] font-medium text-cuarto/70 font-roboto hidden sm:block max-w-[7em] truncate">
          {nombre}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-cuarto/30 text-[0.7em] transition-transform duration-200 hidden sm:block ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && createPortal(
        <div
          style={{ top: dropdownPos.top, right: dropdownPos.right, zIndex: 99999, position: 'fixed' }}
          className="w-[17em] bg-primero-fuerte border border-cuarto/10 rounded-[0.75em] shadow-2xl shadow-primero-oscuro/80 overflow-hidden"
        >
          <div className="px-[1em] py-[0.85em] border-b border-cuarto/10">
            <p className="text-[0.875em] font-semibold text-cuarto font-poppins truncate">{nombre}</p>
            <p className="text-[0.7em] text-cuarto/40 font-roboto truncate mt-[0.1em]">
              {ROL_LABEL[usuario?.rol] ?? usuario?.rol}
            </p>
          </div>

          <div className="px-[1em] pt-[0.75em] pb-[0.4em]">
            <p className="text-[0.65em] font-poppins font-semibold text-cuarto/40 uppercase tracking-wider">
              Acciones y funciones
            </p>
          </div>

          <div className="border-b border-cuarto/10 pb-[0.4em]">
            {acciones.map(({ icon, label, ruta, disabled }) => (
              <button
                key={label}
                onPointerDown={disabled ? undefined : () => handleNavigate(ruta)}
                disabled={disabled}
                className={`w-full flex items-center gap-[0.75em] px-[1em] py-[0.65em] text-[0.85em] font-roboto transition-all duration-200 ${
                  disabled
                    ? 'text-cuarto/30 cursor-not-allowed'
                    : 'text-cuarto/80 hover:text-segundo hover:bg-segundo/10 cursor-pointer'
                }`}
              >
                <FontAwesomeIcon icon={icon} className="text-[0.8em] w-[1em]" />
                <span className="flex-1 text-left truncate">{label}</span>
                {disabled ? (
                  <span className="text-[0.6em] bg-cuarto/5 border border-cuarto/10 rounded-[0.35em] px-[0.5em] py-[0.15em] flex-shrink-0">
                    Solo admin
                  </span>
                ) : (
                  <FontAwesomeIcon icon={faChevronRight} className="text-cuarto/20 text-[0.7em] flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="p-[0.6em]">
            <button
              onPointerDown={() => handleNavigate('/tablero/perfil')}
              className="w-full flex items-center justify-center gap-[0.6em] px-[1em] py-[0.65em] rounded-[0.5em] bg-segundo/15 hover:bg-segundo/25 text-segundo text-[0.85em] font-poppins font-medium transition-all duration-200 cursor-pointer"
            >
              <FontAwesomeIcon icon={faUser} className="text-[0.8em]" />
              Ver perfil completo
            </button>
          </div>

          <button
            onPointerDown={handleLogout}
            className="w-full flex items-center gap-[0.75em] px-[1em] py-[0.85em] text-[0.875em] text-quinto/80 hover:text-quinto-claro hover:bg-quinto/10 transition-all duration-200 font-roboto cursor-pointer border-t border-cuarto/10"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-[0.8em]" />
            Cerrar sesión
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

export default UserMenu;
