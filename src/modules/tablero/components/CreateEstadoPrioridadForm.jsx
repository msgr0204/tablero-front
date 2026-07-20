import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_COLOR = '#38BDF8';

function CreateEstadoPrioridadForm({ isEstado, onCreate, placeholder }) {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [esEstadoFinal, setEsEstadoFinal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!label.trim()) return setError('El nombre es obligatorio.');
    setError('');
    setLoading(true);
    try {
      const payload = { label: label.trim(), color };
      if (isEstado) payload.es_estado_final = esEstadoFinal;
      await onCreate(payload);
      setLabel('');
      setColor(DEFAULT_COLOR);
      setEsEstadoFinal(false);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[0.5em] bg-primero-claro/40 border border-dashed border-cuarto/20 rounded-[0.6em] px-[0.85em] py-[0.7em]">
      <div className="flex items-center gap-[0.5em] flex-wrap">
        <input
          type="text"
          value={label}
          onChange={(e) => { setLabel(e.target.value); setError(''); }}
          placeholder={placeholder}
          className="h-[2.5em] px-[0.75em] rounded-[0.5em] text-[0.85em] font-roboto bg-primero-claro/60 text-cuarto placeholder:text-cuarto/30 border border-cuarto/10 hover:border-cuarto/20 focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40 outline-none flex-1 min-w-[10em]"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          aria-label="Color"
          className="w-[2.5em] h-[2.5em] rounded-[0.5em] border border-cuarto/10 bg-primero-claro/60 cursor-pointer"
        />
        {isEstado && (
          <label className="flex items-center gap-[0.4em] text-[0.75em] text-cuarto/60 font-roboto cursor-pointer select-none">
            <input
              type="checkbox"
              checked={esEstadoFinal}
              onChange={(e) => setEsEstadoFinal(e.target.checked)}
              className="accent-segundo"
            />
            Estado de cierre
          </label>
        )}
        <button
          type="submit"
          disabled={loading || !label.trim()}
          className="h-[2.5em] px-[1em] flex items-center gap-[0.5em] rounded-[0.5em] text-[0.85em] font-poppins font-semibold bg-segundo/10 border border-segundo/30 text-segundo hover:bg-segundo/20 transition-all duration-200 disabled:opacity-40 focus:outline-none flex-shrink-0"
        >
          {loading
            ? <div className="w-[0.85em] h-[0.85em] border border-segundo/40 border-t-segundo rounded-full animate-spin" />
            : <FontAwesomeIcon icon={faPlus} className="text-[0.8em]" />
          }
          Agregar
        </button>
      </div>
      {error && <p className="text-[0.75em] text-quinto-claro font-roboto">{error}</p>}
    </form>
  );
}

export default CreateEstadoPrioridadForm;
