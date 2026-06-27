import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import DeliveryFields from './DeliveryFields';
import StatusFields from './StatusFields';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

function ModuleForm({ onSubmit, onCancel, initialValues }) {
  const { esEstadoFinal } = useEstadosPrioridades();
  const isEdit = Boolean(initialValues);
  const [nombre, setNombre] = useState(initialValues?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(initialValues?.descripcion ?? '');
  const [estado, setEstado] = useState(initialValues?.estado ?? '');
  const [prioridad, setPrioridad] = useState(initialValues?.prioridad ?? '');
  const [fechaEntrega, setFechaEntrega] = useState(initialValues?.fecha_entrega ?? '');
  const [diasMaximos, setDiasMaximos] = useState(initialValues?.dias_maximos ?? '');
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
        icon={<FontAwesomeIcon icon={faCubes} />}
        type="text"
        placeholder="Nombre del módulo"
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

      <StatusFields estado={estado} onEstadoChange={setEstado} prioridad={prioridad} onPrioridadChange={setPrioridad} />

      {isEdit && (
        <DeliveryFields
          fecha={fechaEntrega}
          onFechaChange={setFechaEntrega}
          diasMaximos={diasMaximos}
          onDiasMaximosChange={setDiasMaximos}
        />
      )}

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
          {isEdit ? 'Guardar cambios' : 'Crear módulo'}
        </Button>
      </div>
    </form>
  );
}

export default ModuleForm;
