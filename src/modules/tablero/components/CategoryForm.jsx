import { useState } from 'react';
import { faTag, faSliders } from '@fortawesome/free-solid-svg-icons';
import Select from '../../../components/Select';
import { Campo, Seccion, CamposGrid, ErrorAviso, inputClass, areaClass } from '../../../components/FormKit';
import DeliveryFields from './DeliveryFields';
import VisibilidadToggle from './VisibilidadToggle';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import usePermisosTablero from '../hooks/usePermisosTablero';

export const CATEGORY_FORM_ID = 'form-categoria';

function CategoryForm({ onSubmit, onError, onLoadingChange }) {
  const { estados, prioridades, esEstadoFinal } = useEstadosPrioridades();
  const { puedeMarcarVisibilidad } = usePermisosTablero();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [diasMaximos, setDiasMaximos] = useState('');
  const [visibilidad, setVisibilidad] = useState('publico');
  const [tocado, setTocado] = useState(false);
  const [error, setError] = useState('');

  const errorNombre = !nombre.trim() ? 'El nombre es obligatorio' : '';
  const esFinal = Boolean(estado && esEstadoFinal(estado));

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
        prioridad: esFinal ? null : (prioridad || null),
        fecha_entrega: fechaEntrega || null,
        dias_maximos: diasMaximos !== '' ? parseInt(diasMaximos, 10) : null,
        ...(puedeMarcarVisibilidad ? { visibilidad } : {}),
      });
    } catch (err) {
      const mensaje = err.response?.data?.message ?? err.message;
      setError(mensaje);
      onError?.(mensaje);
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <form id={CATEGORY_FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-[1.5em]">
      <Seccion icon={faTag} titulo="Información">
        <Campo label="Nombre de la categoría" required error={tocado && errorNombre}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setError(''); }}
            onBlur={() => setTocado(true)}
            placeholder="Ej. Plataforma web"
            autoFocus
            className={inputClass(tocado && errorNombre)}
          />
        </Campo>
        <Campo label="Descripción" hint="Opcional">
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            placeholder="Para qué es esta categoría"
            className={areaClass(false)}
          />
        </Campo>
      </Seccion>

      <Seccion icon={faSliders} titulo="Clasificación y entrega">
        <CamposGrid>
          <Campo label="Estado">
            <Select
              value={estado}
              onChange={setEstado}
              placeholder="Sin estado"
              options={[{ value: '', label: 'Sin estado' }, ...estados.map((e) => ({ value: e.id, label: e.label }))]}
            />
          </Campo>
          <Campo label="Prioridad" hint={esFinal ? 'No aplica en un estado de cierre' : undefined}>
            {esFinal ? (
              <span className="w-full h-[2.75em] px-[0.85em] flex items-center rounded-[0.6em] text-[0.85em] text-cuarto/30 italic border border-cuarto/5">
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
          </Campo>
        </CamposGrid>

        <DeliveryFields
          fecha={fechaEntrega}
          onFechaChange={setFechaEntrega}
          diasMaximos={diasMaximos}
          onDiasMaximosChange={setDiasMaximos}
        />

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

export default CategoryForm;
