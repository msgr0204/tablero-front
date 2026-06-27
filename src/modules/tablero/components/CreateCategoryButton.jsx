import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function CreateCategoryButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Crear nueva categoría"
      className={[
        'flex items-center gap-[0.4em] px-[0.85em] sm:px-[1em] h-[2.25em] sm:h-[2.5em] rounded-[0.5em] flex-shrink-0',
        'bg-segundo text-primero-oscuro font-poppins font-semibold text-[0.8em] sm:text-[0.875em] whitespace-nowrap',
        'hover:bg-segundo-claro active:scale-[0.98]',
        'shadow-lg shadow-segundo/20 hover:shadow-segundo/30',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/60',
      ].join(' ')}
    >
      <FontAwesomeIcon icon={faPlus} className="text-[0.8em]" />
      <span className="sm:hidden">Nueva</span>
      <span className="hidden sm:inline">Nueva categoría</span>
    </button>
  );
}

export default CreateCategoryButton;
