import Select from '../../../components/Select';
import { Campo } from '../../../components/FormKit';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

// Estado / Prioridad / Tipo. En un estado de cierre la prioridad y el tipo dejan
// de aplicar (la tarea ya terminó), así que se muestran deshabilitados en vez de
// desaparecer: si el campo se esfumara, el formulario daría un salto.
function StatusFields({
  estado, onEstadoChange,
  prioridad, onPrioridadChange,
  tipo, onTipoChange,
  conTipo = false,
}) {
  const { estados, prioridades, tipos, esEstadoFinal } = useEstadosPrioridades();
  const isFinal = Boolean(estado && esEstadoFinal(estado));

  const noAplica = (
    <span className="w-full h-[2.75em] px-[0.85em] flex items-center rounded-[0.6em] text-[0.85em] text-cuarto/30 italic border border-cuarto/5">
      No aplica
    </span>
  );

  return (
    <div className={`grid grid-cols-2 gap-[0.85em] ${conTipo ? 'sm:grid-cols-3' : ''}`}>
      <Campo label="Estado">
        <Select
          value={estado ?? ''}
          onChange={onEstadoChange}
          placeholder="Sin estado"
          options={[{ value: '', label: 'Sin estado' }, ...estados.map((e) => ({ value: e.id, label: e.label }))]}
        />
      </Campo>

      <Campo label="Prioridad">
        {isFinal ? noAplica : (
          <Select
            value={prioridad ?? ''}
            onChange={onPrioridadChange}
            placeholder="Sin prioridad"
            options={[{ value: '', label: 'Sin prioridad' }, ...prioridades.map((p) => ({ value: p.id, label: p.label }))]}
          />
        )}
      </Campo>

      {conTipo && (
        <Campo label="Tipo" className="col-span-2 sm:col-span-1">
          {isFinal ? noAplica : (
            <Select
              value={tipo ?? ''}
              onChange={onTipoChange}
              placeholder="Sin tipo"
              options={[{ value: '', label: 'Sin tipo' }, ...tipos.map((t) => ({ value: t.id, label: t.label }))]}
            />
          )}
        </Campo>
      )}
    </div>
  );
}

export default StatusFields;
