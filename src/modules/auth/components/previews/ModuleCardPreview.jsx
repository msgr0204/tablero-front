import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faListCheck } from '@fortawesome/free-solid-svg-icons';
import Badge from '../../../../components/Badge';

const ESTADO = { label: 'En análisis', color: 'bg-octavo/10 text-octavo border-octavo/20' };
const PRIORIDAD = { label: 'Nueva funcionalidad', color: 'bg-tercero/10 text-tercero border-tercero/20' };
const ITEMS = ['Permitir edición del plan', 'Agregar canal de venta'];

/**
 * Vista decorativa (no interactiva) de una ModuleCard real, usada
 * únicamente como preview dentro del carrusel de autenticación.
 */
function ModuleCardPreview() {
  return (
    <div className="flex w-full overflow-hidden rounded-[0.85em] bg-primero-claro/80 border border-cuarto/10 shadow-xl shadow-primero-oscuro/40">
      <div className="w-[0.25em] flex-shrink-0 bg-segundo/60" />
      <div className="flex-1 p-[1em] min-w-0">
        <div className="flex items-center gap-[0.4em] flex-wrap mb-[0.5em]">
          <span className="inline-flex items-center px-[0.6em] py-[0.15em] rounded-[0.4em] bg-segundo/10 border border-segundo/20 text-segundo text-[0.7em] font-poppins font-medium">
            Módulo
          </span>
          <Badge config={ESTADO} size="sm" />
          <Badge config={PRIORIDAD} size="sm" />
        </div>

        <div className="flex items-center gap-[0.6em] mb-[0.75em]">
          <div className="w-[1.75em] h-[1.75em] rounded-[0.45em] bg-segundo/10 border border-segundo/20 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faCubes} className="text-segundo text-[0.75em]" />
          </div>
          <p className="text-[0.9em] font-bold font-poppins text-cuarto truncate leading-tight">
            Contabilidad
          </p>
        </div>

        <div className="flex items-center gap-[0.4em] mb-[0.4em]">
          <FontAwesomeIcon icon={faListCheck} className="text-segundo/50 text-[0.65em]" />
          <span className="text-[0.65em] font-semibold text-cuarto/40 font-poppins uppercase tracking-wider">
            Requerimientos
          </span>
        </div>
        <ul className="flex flex-col gap-[0.3em]">
          {ITEMS.map((item, i) => (
            <li key={i} className="flex items-center gap-[0.5em] py-[0.4em] px-[0.5em] rounded-[0.4em] bg-primero/40 border border-cuarto/10 min-w-0">
              <span className="text-[0.65em] text-segundo/40 font-poppins font-semibold w-[1.1em] flex-shrink-0 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.7em] text-cuarto/70 font-roboto truncate flex-1 min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ModuleCardPreview;
