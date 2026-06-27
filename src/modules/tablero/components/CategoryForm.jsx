import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import DeliveryFields from './DeliveryFields';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

function CategoryForm({ onSubmit, onCancel }) {
  const { estados, prioridades, esEstadoFinal } = useEstadosPrioridades();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [diasMaximos, setDiasMaximos] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return setError('El nombre es obligatorio.');
    setError('');
    setLoading(true);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        estado: estado || null,
        prioridad: (estado && esEstadoFinal(estado)) ? null : (prioridad || null),
        fecha_entrega: fechaEntrega || null,
        dias_maximos: diasMaximos !== '' ? parseInt(diasMaximos, 10) : null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[1em]">
      <Input
        icon={<FontAwesomeIcon icon={faTag} />}
        type="text"
        placeholder="Nombre de la categoría"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Input
        icon={<FontAwesomeIcon icon={faAlignLeft} />}
        type="text"
        placeholder="Descripción (opcional)"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-[0.75em]">
        <div className="flex flex-col gap-[0.4em]">
          <label className="text-[0.8em] font-medium text-cuarto/70 font-poppins">Estado</label>
          <Select
            value={estado}
            onChange={setEstado}
            placeholder="Sin estado"
            options={[{ value: '', label: 'Sin estado' }, ...estados.map((e) => ({ value: e.id, label: e.label }))]}
          />
        </div>
        <div className="flex flex-col gap-[0.4em]">
          <label className="text-[0.8em] font-medium text-cuarto/70 font-poppins">Prioridad</label>
          {estado && esEstadoFinal(estado) ? (
            <span className="w-full h-[2.5em] px-[0.85em] flex items-center rounded-[0.5em] text-[0.875em] text-cuarto/30 italic border border-transparent">
              No aplica
            </span>
          ) : (
            <Select
              value={prioridad}
              onChange={setPrioridad}
              placeholder="Sin prioridad"
              options={[{ value: '', label: 'Sin prioridad' }, ...prioridades.map((p) => ({ value: p.id, label: p.label }))]}
            />
          )}
        </div>
      </div>

      <DeliveryFields
        fecha={fechaEntrega}
        onFechaChange={setFechaEntrega}
        diasMaximos={diasMaximos}
        onDiasMaximosChange={setDiasMaximos}
      />

      {error && (
        <p role="alert" className="text-[0.8em] text-quinto-claro text-center bg-quinto/10 border border-quinto/20 rounded-[0.5em] py-[0.5em] px-[0.75em]">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-[0.75em] pt-[0.25em]">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Crear categoría
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;
