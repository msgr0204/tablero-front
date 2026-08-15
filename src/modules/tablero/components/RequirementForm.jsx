import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import StatusFields from './StatusFields';
import DeliveryFields from './DeliveryFields';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

function RequirementForm({ initialText = '', onSubmit, onCancel }) {
  const { esEstadoFinal } = useEstadosPrioridades();
  const [texto, setTexto] = useState(initialText);
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [tipo, setTipo] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [diasMaximos, setDiasMaximos] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const esFinal = estado && esEstadoFinal(estado);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return setError('El texto del requerimiento es obligatorio.');
    setError('');
    setLoading(true);
    try {
      await onSubmit({
        texto: texto.trim(),
        estado: estado || null,
        prioridad: esFinal ? null : (prioridad || null),
        tipo: esFinal ? null : (tipo || null),
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
        icon={<FontAwesomeIcon icon={faListCheck} />}
        type="text"
        placeholder="Texto del requerimiento"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        autoFocus
        required
      />

      <StatusFields
        estado={estado} onEstadoChange={setEstado}
        prioridad={prioridad} onPrioridadChange={setPrioridad}
        tipo={tipo} onTipoChange={setTipo}
        conTipo
      />

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
          Crear requerimiento
        </Button>
      </div>
    </form>
  );
}

export default RequirementForm;
