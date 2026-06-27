import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

function diasDesde(iso) {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  return dias;
}

function SinActividadList({ items }) {
  return (
    <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] p-[1.25em] flex flex-col gap-[1em]">
      <h3 className="text-[0.85em] font-semibold text-cuarto font-poppins uppercase tracking-wider">
        Sin actividad reciente (7+ días)
      </h3>
      {items.length === 0 ? (
        <p className="text-[0.85em] text-cuarto/25 italic font-roboto py-[1em] text-center">Todo tiene movimiento reciente</p>
      ) : (
        <ul className="flex flex-col gap-[0.5em]">
          {items.map((item) => (
            <li
              key={item.requerimientoId}
              className="flex items-center gap-[0.75em] bg-primero/40 border border-cuarto/10 rounded-[0.6em] px-[0.85em] py-[0.7em]"
            >
              <FontAwesomeIcon icon={faMoon} className="text-[0.85em] text-cuarto/30 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[0.85em] text-cuarto/80 font-roboto truncate">{item.texto}</p>
                <p className="text-[0.7em] text-cuarto/40 font-roboto truncate">{item.moduloNombre}</p>
              </div>
              <span className="text-[0.75em] text-cuarto/40 font-roboto flex-shrink-0">
                {diasDesde(item.ultimaActividad)} días
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SinActividadList;
