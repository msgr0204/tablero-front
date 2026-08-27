import { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAmbito } from '../../../context/AmbitoContext';
import colaboradorService from '../services/colaboradorService';

// Dropdown del header del tablero personal: alterna entre "Mi tablero" (ownerId
// null) y los tableros que otros me compartieron. Al elegir, cambia el ownerId
// del contexto (que viaja como X-Owner-Id) y avisa al padre para refrescar.
function SelectorTablero({ onCambiar }) {
  const { ownerId, setOwnerId } = useAmbito();
  const [compartidos, setCompartidos] = useState([]);

  useEffect(() => {
    let activo = true;
    colaboradorService.getCompartidosConmigo()
      .then((data) => { if (activo) setCompartidos(data ?? []); })
      .catch(() => { if (activo) setCompartidos([]); });
    return () => { activo = false; };
  }, []);

  if (compartidos.length === 0) return null;

  const opciones = [
    { value: null, label: 'Mi tablero' },
    ...compartidos.map((t) => ({ value: t.ownerId, label: `Tablero de ${t.nombre}` })),
  ];

  const seleccionada = opciones.find((o) => o.value === ownerId) ?? opciones[0];

  const handleChange = (nuevoOwnerId) => {
    setOwnerId(nuevoOwnerId ?? null);
    onCambiar?.(nuevoOwnerId ?? null);
  };

  return (
    <Listbox value={ownerId ?? null} onChange={handleChange}>
      <div className="relative">
        <Listbox.Button className="flex items-center gap-[0.5em] px-[0.75em] h-[2.25em] rounded-[0.5em] text-[0.8em] font-roboto text-cuarto bg-primero-claro/60 border border-cuarto/10 hover:border-segundo/40 transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-segundo/40">
          <span className="truncate max-w-[12em]">{seleccionada.label}</span>
          <FontAwesomeIcon icon={faChevronDown} className="text-[0.7em] text-cuarto/35 flex-shrink-0" />
        </Listbox.Button>

        <Listbox.Options className="absolute right-0 z-50 mt-[0.4em] min-w-[12em] max-h-[16em] overflow-auto rounded-[0.6em] bg-primero-fuerte border border-cuarto/10 shadow-xl shadow-primero-oscuro/60 py-[0.3em] outline-none">
          {opciones.map((opt) => (
            <Listbox.Option
              key={opt.value ?? '__mio__'}
              value={opt.value}
              className={({ active }) => [
                'flex items-center justify-between gap-[0.5em] px-[0.85em] py-[0.55em] cursor-pointer',
                'text-[0.8em] font-roboto',
                active ? 'bg-segundo/10 text-segundo' : 'text-cuarto/80',
              ].join(' ')}
            >
              {({ selected }) => (
                <>
                  <span className="truncate">{opt.label}</span>
                  {selected && <FontAwesomeIcon icon={faCheck} className="text-[0.7em] flex-shrink-0" />}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

export default SelectorTablero;
