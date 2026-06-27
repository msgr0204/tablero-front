import { Listbox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * Dropdown propio (Headless UI Listbox) en vez del <select> nativo:
 * el navegador renderiza las opciones de un <select> con su propio
 * tamaño de fuente, ignorando nuestro font-size en em.
 *
 * Las opciones usan `anchor` (Listbox.Options) para renderizarse en un
 * portal posicionado con Floating UI: así escapan del `overflow-hidden`
 * de la card contenedora en vez de quedar recortadas dentro de ella.
 */
function Select({ value, onChange, options, placeholder = 'Seleccionar', disabled = false, size = 'md', fitContent = false }) {
  const selected = options.find((opt) => opt.value === value) ?? null;
  const heightClass = size === 'sm' ? 'h-[2.25em]' : 'h-[2.5em]';
  const textClass = size === 'sm' ? 'text-[0.8em]' : 'text-[0.85em]';

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <Listbox.Button
        className={[
          fitContent ? 'w-auto min-w-[8em]' : 'w-full',
          'flex items-center justify-between gap-[0.5em] px-[0.75em] rounded-[0.5em]',
          heightClass, textClass,
          'font-roboto bg-primero-claro/60 text-cuarto border border-cuarto/10',
          'hover:border-cuarto/20 transition-all duration-200 outline-none',
          'focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        <span className={`truncate ${!selected ? 'text-cuarto/35' : ''}`}>
          {selected ? selected.label : placeholder}
        </span>
        <FontAwesomeIcon icon={faChevronDown} className="text-[0.7em] text-cuarto/35 flex-shrink-0" />
      </Listbox.Button>

      <Listbox.Options
        anchor="bottom start"
        transition
        className={[
          fitContent ? 'w-max min-w-[var(--button-width)]' : 'w-[var(--button-width)]',
          'z-50 max-h-[14em] overflow-auto mt-[0.4em]',
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
              textClass, 'font-roboto truncate',
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

export default Select;
