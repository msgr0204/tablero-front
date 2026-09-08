import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faListCheck, faFlag, faLayerGroup, faSliders } from '@fortawesome/free-solid-svg-icons';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AppHeader from '../../../components/AppHeader';
import { Esqueleto } from '../../../components/Skeleton';
import EstadoPrioridadItem from '../components/EstadoPrioridadItem';
import CreateEstadoPrioridadForm from '../components/CreateEstadoPrioridadForm';
import useDragSensors from '../../../hooks/useDragSensors';
import useTableroBase from '../hooks/useTableroBase';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import { useBranding } from '../../../context/BrandingContext';

function ConfiguracionEstados() {
  const navigate = useNavigate();
  const base = useTableroBase();
  const { branding } = useBranding();
  const {
    estados, prioridades, tipos, loading,
    createEstado, updateEstado, removeEstado, reorderEstados,
    createPrioridad, updatePrioridad, removePrioridad, reorderPrioridades,
    createTipo, updateTipo, removeTipo, reorderTipos,
  } = useEstadosPrioridades();
  const sensors = useDragSensors();

  const reordenar = (lista, reorder) => ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = lista.findIndex((x) => x.id === active.id);
    const newIndex = lista.findIndex((x) => x.id === over.id);
    reorder(arrayMove(lista, oldIndex, newIndex).map((x) => x.id));
  };

  return (
    <div className="min-h-dvh bg-primero text-cuarto font-roboto">
      <AppHeader logoUrl={branding?.logoUrl} nombreMarca={branding?.nombreMarca}>
        <div className="flex items-center gap-[0.5em] sm:gap-[0.75em] min-w-0 flex-1">
          <button
            onClick={() => navigate(base)}
            aria-label="Volver al tablero"
            className="w-[2.5em] h-[2.5em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-[0.85em]" />
          </button>
          <h1 className="text-[0.85em] sm:text-[0.95em] font-semibold font-poppins text-cuarto tracking-tight truncate">
            Configuración del catálogo
          </h1>
        </div>
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] xl:px-[2em] py-[1.25em] sm:py-[1.75em] flex flex-col gap-[1.5em]">

        {/* Encabezado de sección, mismo patrón que el resto de pantallas */}
        <div className="flex items-center gap-[0.85em]">
          <div className="w-[3em] h-[3em] rounded-[0.9em] bg-segundo/10 border border-segundo/25 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faSliders} className="text-segundo text-[1.15em]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[1.15em] sm:text-[1.3em] font-bold font-poppins text-cuarto tracking-tight leading-tight">
              Estados, prioridades y tipos
            </h2>
            <p className="text-[0.8em] text-cuarto/50 font-roboto mt-[0.15em]">
              Personaliza los catálogos disponibles en tu tablero
            </p>
          </div>
        </div>

        {loading ? (
          <PanelesSkeleton />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-[1.25em]">
            <SeccionPanel
              icon={faListCheck} titulo="Estados" total={estados.length}
              lista={
                <ListaOrdenable
                  items={estados} sensors={sensors} onDragEnd={reordenar(estados, reorderEstados)}
                  render={(estado) => (
                    <EstadoPrioridadItem key={estado.id} item={estado} isEstado nombreEntidad="el estado" onUpdate={updateEstado} onRemove={removeEstado} />
                  )}
                />
              }
              form={<CreateEstadoPrioridadForm isEstado onCreate={createEstado} placeholder="Nuevo estado..." />}
            />

            <SeccionPanel
              icon={faFlag} titulo="Prioridades" total={prioridades.length}
              lista={
                <ListaOrdenable
                  items={prioridades} sensors={sensors} onDragEnd={reordenar(prioridades, reorderPrioridades)}
                  render={(prioridad) => (
                    <EstadoPrioridadItem key={prioridad.id} item={prioridad} isEstado={false} nombreEntidad="la prioridad" onUpdate={updatePrioridad} onRemove={removePrioridad} />
                  )}
                />
              }
              form={<CreateEstadoPrioridadForm isEstado={false} onCreate={createPrioridad} placeholder="Nueva prioridad..." />}
            />

            <SeccionPanel
              icon={faLayerGroup} titulo="Tipos" total={tipos.length}
              lista={
                <ListaOrdenable
                  items={tipos} sensors={sensors} onDragEnd={reordenar(tipos, reorderTipos)}
                  render={(tipo) => (
                    <EstadoPrioridadItem key={tipo.id} item={tipo} isEstado={false} nombreEntidad="el tipo" onUpdate={updateTipo} onRemove={removeTipo} />
                  )}
                />
              }
              form={<CreateEstadoPrioridadForm isEstado={false} onCreate={createTipo} placeholder="Nuevo tipo..." />}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// Panel-tarjeta de una sección del catálogo. Ocupa toda la altura de su celda
// del grid (h-full) para que las 3 columnas queden parejas; la lista crece
// (flex-1) y el form de agregar queda anclado al fondo, así el espacio sobrante
// del panel más corto cae entre la lista y el form, no como un hueco flotante.
function SeccionPanel({ icon, titulo, total, lista, form }) {
  return (
    <section className="flex flex-col h-full rounded-[1em] border border-cuarto/10 bg-primero-claro/40 p-[1em]">
      <div className="flex items-center gap-[0.6em] mb-[0.85em]">
        <span className="w-[2em] h-[2em] rounded-[0.6em] bg-segundo/10 border border-segundo/20 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={icon} className="text-segundo text-[0.8em]" />
        </span>
        <h3 className="text-[0.85em] font-semibold font-poppins text-cuarto uppercase tracking-wider">{titulo}</h3>
        <span className="ml-auto text-[0.75em] font-poppins font-semibold text-cuarto/40 bg-cuarto/5 rounded-full px-[0.6em] py-[0.1em]">{total}</span>
      </div>
      <div className="flex-1">{lista}</div>
      <div className="mt-[0.85em]">{form}</div>
    </section>
  );
}

function ListaOrdenable({ items, sensors, onDragEnd, render }) {
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-[0.5em]">
          {items.map(render)}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

// Skeleton de los 3 paneles mientras carga el catálogo.
function PanelesSkeleton() {
  return (
    <Esqueleto etiqueta="Cargando el catálogo" className="grid grid-cols-1 xl:grid-cols-3 gap-[1.25em] items-start">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-[1em] border border-cuarto/10 bg-primero-claro/40 p-[1em] flex flex-col gap-[0.75em]">
          <span className="tq-shimmer block w-[45%] h-[1.2em] rounded-[0.4em]" />
          {Array.from({ length: 4 }).map((__, j) => (
            <span key={j} className="tq-shimmer block w-full h-[2.6em] rounded-[0.6em]" />
          ))}
        </div>
      ))}
    </Esqueleto>
  );
}

export default ConfiguracionEstados;
