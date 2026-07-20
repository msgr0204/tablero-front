import Select from '../../../components/Select';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

function StatusFields({
  estado, onEstadoChange,
  prioridad, onPrioridadChange,
  tipo, onTipoChange,
  conTipo = false,
  size = 'md',
}) {
  const { estados, prioridades, tipos, esEstadoFinal } = useEstadosPrioridades();
  const isFinal = estado && esEstadoFinal(estado);

  return (
    <div className={`grid ${conTipo ? 'grid-cols-3' : 'grid-cols-2'} gap-[0.75em]`}>
      <div className="flex flex-col gap-[0.3em]">
        <label className="text-[0.75em] text-cuarto/50 font-roboto">Estado</label>
        <Select
          value={estado ?? ''}
          onChange={onEstadoChange}
          placeholder="Sin estado"
          size={size}
          options={[{ value: '', label: 'Sin estado' }, ...estados.map((e) => ({ value: e.id, label: e.label }))]}
        />
      </div>
      <div className="flex flex-col gap-[0.3em]">
        <label className="text-[0.75em] text-cuarto/50 font-roboto">Prioridad</label>
        {isFinal ? (
          <span className="w-full h-[2.5em] px-[0.75em] flex items-center rounded-[0.5em] text-[0.85em] text-cuarto/30 italic border border-transparent">
            No aplica
          </span>
        ) : (
          <Select
            value={prioridad ?? ''}
            onChange={onPrioridadChange}
            placeholder="Sin prioridad"
            size={size}
            options={[{ value: '', label: 'Sin prioridad' }, ...prioridades.map((p) => ({ value: p.id, label: p.label }))]}
          />
        )}
      </div>
      {conTipo && (
        <div className="flex flex-col gap-[0.3em]">
          <label className="text-[0.75em] text-cuarto/50 font-roboto">Tipo</label>
          <Select
            value={tipo ?? ''}
            onChange={onTipoChange}
            placeholder="Sin tipo"
            size={size}
            options={[{ value: '', label: 'Sin tipo' }, ...tipos.map((t) => ({ value: t.id, label: t.label }))]}
          />
        </div>
      )}
    </div>
  );
}

export default StatusFields;
