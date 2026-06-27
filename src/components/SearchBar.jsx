import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowUpAZ, faArrowDownAZ, faCalendarDays, faCalendarCheck, faXmark, faSliders } from '@fortawesome/free-solid-svg-icons';

const SORT_OPTIONS = [
  { value: 'custom', label: 'Personalizado', icon: faSliders },
  { value: 'newest', label: 'Más reciente', icon: faCalendarCheck },
  { value: 'oldest', label: 'Más antiguo', icon: faCalendarDays },
  { value: 'az', label: 'A → Z', icon: faArrowUpAZ, toggle: 'za' },
];

const TOGGLE_META = {
  za: { label: 'Z → A', icon: faArrowDownAZ },
};

const DEFAULT_SORT = 'custom';

function SearchBar({ query, onQuery, sort, onSort, placeholder = 'Buscar...', hasExtraFilters = false, onClearExtraFilters, children }) {
  const hasFilters = query.trim() !== '' || sort !== DEFAULT_SORT || hasExtraFilters;

  const handleClear = () => {
    onQuery('');
    onSort(DEFAULT_SORT);
    onClearExtraFilters?.();
  };

  return (
    <div className="flex flex-col gap-[0.6em] mb-[1em] sm:mb-[1.5em]">
      <div className="flex flex-wrap sm:flex-nowrap gap-[0.5em]">
        <div className="relative w-full sm:flex-1 sm:min-w-[9em]">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-[0.85em] top-1/2 -translate-y-1/2 text-cuarto/30 text-[0.8em] pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[2.5em] pl-[2.25em] pr-[1em] rounded-[0.5em] bg-primero-claro border border-cuarto/10 text-cuarto placeholder:text-cuarto/30 font-roboto text-[0.9em] outline-none focus:border-segundo focus:ring-1 focus:ring-segundo/40 transition-all duration-200"
          />
        </div>

        <div className="flex gap-[0.4em] flex-wrap sm:flex-nowrap items-center flex-shrink-0">
          {SORT_OPTIONS.map((opt) => {
            const isActive = sort === opt.value || sort === opt.toggle;
            const isToggled = sort === opt.toggle;
            const meta = isToggled ? TOGGLE_META[opt.toggle] : null;
            const icon = meta ? meta.icon : opt.icon;
            const label = meta ? meta.label : opt.label;

            const handleClick = () => {
              if (sort === opt.value && opt.toggle) onSort(opt.toggle);
              else if (sort === opt.toggle) onSort(opt.value);
              else onSort(opt.value);
            };

            return (
              <button
                key={opt.value}
                onClick={handleClick}
                aria-label={label}
                title={label}
                className={[
                  'flex items-center gap-[0.4em] px-[0.75em] h-[2.5em] rounded-[0.5em] text-[0.8em] font-poppins font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 whitespace-nowrap',
                  isActive
                    ? 'bg-segundo text-primero-oscuro shadow-md shadow-segundo/20'
                    : 'bg-primero-claro border border-cuarto/10 text-cuarto/50 hover:border-segundo/40 hover:text-cuarto',
                ].join(' ')}
              >
                <FontAwesomeIcon icon={icon} className="text-[0.85em]" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}

          {children}

          {hasFilters && (
            <button
              onClick={handleClear}
              aria-label="Limpiar filtros"
              title="Limpiar filtros"
              className="flex items-center justify-center w-[2.5em] h-[2.5em] rounded-[0.5em] border border-quinto/30 text-quinto/60 hover:bg-quinto/10 hover:text-quinto-claro hover:border-quinto/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-quinto/50 flex-shrink-0"
            >
              <FontAwesomeIcon icon={faXmark} className="text-[0.9em]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
