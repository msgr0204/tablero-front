import { Listbox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * Filtro con la misma estética de pill que los botones de orden de SearchBar
 * (icono + label, mismo fondo activo/inactivo), pero con un dropdown real
 * detrás (Headless UI Listbox + anchor) para no quedar recortado por
 * `overflow-hidden` de contenedores padres.
 */
function FilterDropdown({ icon, value, onChange, options, placeholder }) {
  const selected = options.find((opt) => opt.value === value) ?? null;
  const isActive = value !== '' && value != null;
  const label = selected ? selected.label : placeholder;

  return (
    <Listbox value={value} onChange={onChange}>
      <Listbox.Button
        title={label}
        className={[
          'flex items-center gap-[0.4em] px-[0.75em] h-[2.5em] rounded-[0.5em] text-[0.8em] font-poppins font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 whitespace-nowrap max-w-[10em]',
          isActive
            ? 'bg-segundo text-primero-oscuro shadow-md shadow-segundo/20'
            : 'bg-primero-claro border border-cuarto/10 text-cuarto/50 hover:border-segundo/40 hover:text-cuarto',
        ].join(' ')}
      >
        <FontAwesomeIcon icon={icon} className="text-[0.85em] flex-shrink-0" />
        <span className="truncate">{label}</span>
      </Listbox.Button>

      <Listbox.Options
        anchor="bottom start"
        transition
        className={[
          'w-max min-w-[var(--button-width)] z-50 max-h-[14em] overflow-auto mt-[0.4em]',
          'rounded-[0.6em] bg-primero-fuerte border border-cuarto/10',
          'shadow-xl shadow-primero-oscuro/60 py-[0.3em] outline-none',
          'transition duration-150 ease-out data-[closed]:opacity-0 data-[closed]:scale-95 data-[leave]:opacity-0',
        ].join(' ')}
      >
        {options.map((opt) => (
          <Listbox.Option
            key={opt.value || '__empty__'}
            value={opt.value}
            className={({ active }) => [
              'flex items-center justify-between gap-[0.5em] px-[0.85em] py-[0.55em] cursor-pointer',
              'text-[0.8em] font-roboto truncate',
              active ? 'bg-segundo/10 text-segundo' : 'text-cuarto/80',
            ].join(' ')}
          >
            {({ selected: isSelected }) => (
              <>
                <span className="truncate">{opt.label}</span>
                {isSelected && <FontAwesomeIcon icon={faCheck} className="text-[0.7em] flex-shrink-0" />}
              </>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}

export default FilterDropdown;
