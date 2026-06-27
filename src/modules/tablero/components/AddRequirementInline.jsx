import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import StatusFields from './StatusFields';
import DeliveryFields from './DeliveryFields';
import useDraft from '../../../hooks/useDraft';

function AddRequirementInline({ onAdd, draftKey = 'req_inline' }) {
  const [texto, setTexto, clearDraft] = useDraft(draftKey, '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [fecha, setFecha] = useState('');
  const [diasMaximos, setDiasMaximos] = useState('');
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');

  const handleAdd = async () => {
    if (!texto.trim()) { setError(true); return; }
    setError(false);
    setLoading(true);
    try {
      await onAdd({
        texto: texto.trim(),
        fecha_entrega: fecha || null,
        dias_maximos: diasMaximos !== '' ? parseInt(diasMaximos, 10) : null,
        estado: estado || null,
        prioridad: prioridad || null,
      });
      clearDraft();
      setFecha('');
      setDiasMaximos('');
      setEstado('');
      setPrioridad('');
      setShowMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
  };

  return (
    <div className="flex flex-col gap-[0.6em] px-[1.25em] sm:px-[1.5em] py-[0.85em] border-b border-cuarto/10 flex-shrink-0">
      <div className="flex gap-[0.5em]">
        <input
          type="text"
          value={texto}
          onChange={(e) => { setTexto(e.target.value); if (error) setError(false); }}
          onKeyDown={handleKeyDown}
          placeholder="Agregar requerimiento..."
          aria-label="Nuevo requerimiento"
          className={[
            'flex-1 h-[2.5em] px-[0.85em] rounded-[0.5em] bg-primero-claro/60 text-cuarto placeholder:text-cuarto/30',
            'border outline-none transition-all duration-200 font-roboto text-[0.9em]',
            error ? 'border-quinto/50 focus:border-quinto/70' : 'border-cuarto/10 hover:border-cuarto/20 focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40',
          ].join(' ')}
        />
        <button
          onClick={() => setShowMore((p) => !p)}
          aria-label="Más opciones"
          type="button"
          className={`w-[2.5em] h-[2.5em] flex items-center justify-center rounded-[0.5em] border transition-all duration-200 focus:outline-none flex-shrink-0 ${showMore ? 'bg-segundo/20 border-segundo/50 text-segundo' : 'bg-primero-claro/60 border-cuarto/10 text-cuarto/40 hover:text-segundo hover:border-segundo/40'}`}
        >
          <FontAwesomeIcon icon={faCalendarDays} className="text-[0.8em]" />
        </button>
        <button
          onClick={handleAdd}
          disabled={loading}
          aria-label="Agregar"
          className="w-[2.5em] h-[2.5em] flex items-center justify-center rounded-[0.5em] bg-segundo/10 border border-segundo/30 text-segundo hover:bg-segundo/20 transition-all duration-200 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 flex-shrink-0"
        >
          {loading
            ? <div className="w-[0.9em] h-[0.9em] border border-segundo/40 border-t-segundo rounded-full animate-spin" />
            : <FontAwesomeIcon icon={faPlus} className="text-[0.8em]" />
          }
        </button>
      </div>
      {showMore && (
        <div className="flex flex-col gap-[0.6em]">
          <DeliveryFields fecha={fecha} onFechaChange={setFecha} diasMaximos={diasMaximos} onDiasMaximosChange={setDiasMaximos} />
          <StatusFields estado={estado} onEstadoChange={setEstado} prioridad={prioridad} onPrioridadChange={setPrioridad} size="sm" />
        </div>
      )}
      {error && <p className="text-[0.8em] text-quinto-claro font-roboto">Escribe un requerimiento.</p>}
    </div>
  );
}

export default AddRequirementInline;
