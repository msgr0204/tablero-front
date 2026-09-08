import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Campo, inputClass } from '../../../components/FormKit';

// Fecha de entrega del ítem.
//
// Junto a la fecha vivía "Días máximos", que generaba un código legible (D5DM).
// Se desactivó: no alimentaba ninguna métrica ni lógica —la fecha de entrega ya
// cubre el plazo— y estaba sin usar en la práctica. El campo sigue existiendo en
// los modelos del backend, así que los datos guardados no se pierden y basta con
// descomentar para recuperarlo.
function DeliveryFields({ fecha, onFechaChange /*, diasMaximos, onDiasMaximosChange */ }) {
  // const codigo = diasMaximos !== '' && diasMaximos !== null && !isNaN(parseInt(diasMaximos, 10))
  //   ? `D${parseInt(diasMaximos, 10)}DM`
  //   : null;

  return (
    <Campo label="Fecha de entrega">
      <div className="flex items-center gap-[0.4em]">
        <input
          type="date"
          value={fecha ?? ''}
          onChange={(e) => onFechaChange(e.target.value)}
          className={`${inputClass(false)} flex-1 min-w-0`}
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
    </Campo>
  );

  /* Días máximos — desactivado (ver nota arriba). Para recuperarlo, envolver el
     campo de fecha y este bloque en el grid original:

     <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-[0.85em]">
       ...campo de fecha...
       <div className="w-[6em] flex-shrink-0">
         <Campo label="ID" hint={codigo ?? undefined}>
           <input
             type="number"
             min="1"
             value={diasMaximos ?? ''}
             onChange={(e) => onDiasMaximosChange(e.target.value)}
             placeholder="—"
             className={`${inputClass(false)} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
           />
         </Campo>
       </div>
     </div>
  */
}

export default DeliveryFields;
