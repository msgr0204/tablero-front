import { useState } from 'react';
import { faListCheck, faSliders } from '@fortawesome/free-solid-svg-icons';
import { Campo, Seccion, ErrorAviso, areaClass } from '../../../components/FormKit';
import StatusFields from './StatusFields';
import DeliveryFields from './DeliveryFields';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

export const REQUIREMENT_FORM_ID = 'form-requerimiento';

function RequirementForm({ initialText = '', onSubmit, onLoadingChange }) {
  const { esEstadoFinal } = useEstadosPrioridades();
  const [texto, setTexto] = useState(initialText);
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [tipo, setTipo] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [diasMaximos, setDiasMaximos] = useState('');
  const [tocado, setTocado] = useState(false);
  const [error, setError] = useState('');

  const esFinal = estado && esEstadoFinal(estado);
  const errorTexto = !texto.trim() ? 'El texto es obligatorio' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorTexto) {
      setTocado(true);
      setError('Corrige los campos marcados.');
      return;
    }
    setError('');
    onLoadingChange?.(true);
    try {
      await onSubmit({
        texto: texto.trim(),
        estado: estado || null,
        prioridad: esFinal ? null : (prioridad || null),
        tipo: esFinal ? null : (tipo || null),
        fecha_entrega: fechaEntrega || null,
        dias_maximos: diasMaximos !== '' ? parseInt(diasMaximos, 10) : null,
      });
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <form id={REQUIREMENT_FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-[1.5em]">
      <Seccion icon={faListCheck} titulo="Requerimiento">
        {/* Área de varias líneas: un requerimiento suele ser una frase larga y en
            un input de una línea el principio se pierde de vista al escribir. */}
        <Campo label="Texto del requerimiento" required error={tocado && errorTexto}>
          <textarea
            value={texto}
            onChange={(e) => { setTexto(e.target.value); setError(''); }}
            onBlur={() => setTocado(true)}
            rows={3}
            placeholder="Describe qué se necesita"
            autoFocus
            className={areaClass(tocado && errorTexto)}
          />
        </Campo>
      </Seccion>

      <Seccion icon={faSliders} titulo="Clasificación y entrega">
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
      </Seccion>

      <ErrorAviso>{error}</ErrorAviso>
    </form>
  );
}

export default RequirementForm;
