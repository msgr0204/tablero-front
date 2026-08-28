import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

// Toggle público/privado para categorías y módulos del tablero personal. Solo se
// renderiza cuando el dueño edita lo suyo (el llamador decide con
// usePermisosTablero().puedeMarcarVisibilidad). Trabaja sobre el string
// 'publico'|'privado' que espera el backend.
function VisibilidadToggle({ value, onChange }) {
  const esPrivado = value === 'privado';

  return (
    <button
      type="button"
      onClick={() => onChange(esPrivado ? 'publico' : 'privado')}
      aria-pressed={esPrivado}
      className={[
        'flex items-center gap-[0.5em] px-[0.75em] h-[2.5em] rounded-[0.5em] text-[0.8em] font-roboto',
        'border transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-segundo/40 w-full',
        esPrivado
          ? 'bg-tercero/10 border-tercero/30 text-tercero'
          : 'bg-primero-claro/60 border-cuarto/10 text-cuarto/60 hover:border-cuarto/20',
      ].join(' ')}
    >
      <FontAwesomeIcon icon={esPrivado ? faLock : faLockOpen} className="text-[0.85em]" />
      <span>{esPrivado ? 'Privado — solo tú lo ves' : 'Público — tu equipo lo ve'}</span>
    </button>
  );
}

export default VisibilidadToggle;
