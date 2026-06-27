import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colorsToCssVars from '../../../lib/colorsToCssVars';
import CategoryCardPreview from './previews/CategoryCardPreview';

function PlantillaCard({ plantilla, seleccionada, onSelect }) {
  const style = colorsToCssVars(plantilla.colors);

  return (
    <button
      type="button"
      onClick={() => onSelect(plantilla.id)}
      style={style}
      className={`relative rounded-[1em] p-[1em] text-left transition-all bg-primero border-2 ${
        seleccionada ? 'border-segundo shadow-lg shadow-segundo/20' : 'border-cuarto/10 hover:border-cuarto/30'
      }`}
    >
      {seleccionada && (
        <span className="absolute top-[0.7em] right-[0.7em] z-10 flex items-center justify-center w-[1.6em] h-[1.6em] rounded-full bg-segundo text-primero">
          <FontAwesomeIcon icon={faCheck} className="text-[0.75em]" />
        </span>
      )}
      <CategoryCardPreview />
      <p className="mt-[0.75em] text-center text-[0.85em] font-poppins font-semibold text-cuarto">
        {plantilla.nombre}
      </p>
    </button>
  );
}

export default PlantillaCard;
