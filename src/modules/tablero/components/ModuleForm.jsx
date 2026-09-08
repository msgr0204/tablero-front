import { useState } from 'react';
import { faCubes, faSliders } from '@fortawesome/free-solid-svg-icons';
import { Campo, Seccion, ErrorAviso, inputClass, areaClass } from '../../../components/FormKit';
import DeliveryFields from './DeliveryFields';
import StatusFields from './StatusFields';
import VisibilidadToggle from './VisibilidadToggle';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import usePermisosTablero from '../hooks/usePermisosTablero';

export const MODULE_FORM_ID = 'form-modulo';

function ModuleForm({ onSubmit, initialValues, onLoadingChange }) {
  const { esEstadoFinal } = useEstadosPrioridades();
  const { puedeMarcarVisibilidad } = usePermisosTablero();
  const isEdit = Boolean(initialValues);
  const [nombre, setNombre] = useState(initialValues?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(initialValues?.descripcion ?? '');
  const [estado, setEstado] = useState(initialValues?.estado ?? '');
  const [prioridad, setPrioridad] = useState(initialValues?.prioridad ?? '');
  const [fechaEntrega, setFechaEntrega] = useState(initialValues?.fecha_entrega ?? '');
  const [diasMaximos, setDiasMaximos] = useState(initialValues?.dias_maximos ?? '');
  const [visibilidad, setVisibilidad] = useState(initialValues?.visibilidad ?? 'publico');
  const [tocado, setTocado] = useState(false);
  const [error, setError] = useState('');

  const errorNombre = !nombre.trim() ? 'El nombre es obligatorio' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorNombre) {
      setTocado(true);
      setError('Corrige los campos marcados.');
      return;
    }
    setError('');
    onLoadingChange?.(true);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        estado: estado || null,
        prioridad: (estado && esEstadoFinal(estado)) ? null : (prioridad || null),
        fecha_entrega: fechaEntrega || null,
        dias_maximos: diasMaximos !== '' ? parseInt(diasMaximos, 10) : null,
        ...(puedeMarcarVisibilidad ? { visibilidad } : {}),
      });
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <form id={MODULE_FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-[1.5em]">
      <Seccion icon={faCubes} titulo="Información">
        <Campo label="Nombre del módulo" required error={tocado && errorNombre}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setError(''); }}
            onBlur={() => setTocado(true)}
            placeholder="Ej. Autenticación"
            autoFocus
            className={inputClass(tocado && errorNombre)}
          />
        </Campo>
        <Campo label="Descripción" hint="Opcional">
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            placeholder="Qué abarca este módulo"
            className={areaClass(false)}
          />
        </Campo>
      </Seccion>

      <Seccion icon={faSliders} titulo="Clasificación y entrega">
        <StatusFields estado={estado} onEstadoChange={setEstado} prioridad={prioridad} onPrioridadChange={setPrioridad} />

        {isEdit && (
          <DeliveryFields
            fecha={fechaEntrega}
            onFechaChange={setFechaEntrega}
            diasMaximos={diasMaximos}
            onDiasMaximosChange={setDiasMaximos}
          />
        )}

        {puedeMarcarVisibilidad && (
          <Campo label="Visibilidad">
            <VisibilidadToggle value={visibilidad} onChange={setVisibilidad} />
          </Campo>
        )}
      </Seccion>

      <ErrorAviso>{error}</ErrorAviso>
    </form>
  );
}

export default ModuleForm;
