import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function DeliveryFields({ fecha, onFechaChange, diasMaximos, onDiasMaximosChange }) {
  const codigo = diasMaximos !== '' && diasMaximos !== null && !isNaN(parseInt(diasMaximos, 10))
    ? `D${parseInt(diasMaximos, 10)}DM`
    : null;

  const fieldClass = 'h-[2.5em] px-[0.75em] rounded-[0.5em] text-[0.85em] font-roboto bg-primero-claro/60 text-cuarto border border-cuarto/10 hover:border-cuarto/20 focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40 outline-none transition-all duration-200';

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-[0.75em]">
      <div className="flex flex-col gap-[0.3em] min-w-0">
        <label className="text-[0.75em] text-cuarto/50 font-roboto">Fecha de entrega</label>
        <div className="flex items-center gap-[0.4em]">
          <input
            type="date"
            value={fecha ?? ''}
            onChange={(e) => onFechaChange(e.target.value)}
            className={`${fieldClass} flex-1 min-w-0`}
          />
          {fecha && (
            <button
              type="button"
              onClick={() => onFechaChange('')}
              aria-label="Limpiar fecha"
              className="text-cuarto/30 hover:text-cuarto/60 transition-colors flex-shrink-0"
            >
              <FontAwesomeIcon icon={faXmark} className="text-[0.85em]" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[0.3em] w-[5.5em] flex-shrink-0">
        <div className="flex items-center justify-between gap-[0.25em]">
          <label className="text-[0.75em] text-cuarto/50 font-roboto">ID</label>
          {codigo && (
            <span className="text-[0.7em] font-mono font-bold tracking-widest text-cuarto/40 select-all truncate">
              {codigo}
            </span>
          )}
        </div>
        <input
          type="number"
          min="1"
          value={diasMaximos ?? ''}
          onChange={(e) => onDiasMaximosChange(e.target.value)}
          placeholder="—"
          className={`${fieldClass} w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
        />
      </div>
    </div>
  );
}

export default DeliveryFields;
