import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faListCheck, faFlag, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AppHeader from '../../../components/AppHeader';
import EstadoPrioridadItem from '../components/EstadoPrioridadItem';
import CreateEstadoPrioridadForm from '../components/CreateEstadoPrioridadForm';
import useDragSensors from '../../../hooks/useDragSensors';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';
import { useBranding } from '../../../context/BrandingContext';

function ConfiguracionEstados() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const {
    estados, prioridades, tipos, loading,
    createEstado, updateEstado, removeEstado, reorderEstados,
    createPrioridad, updatePrioridad, removePrioridad, reorderPrioridades,
    createTipo, updateTipo, removeTipo, reorderTipos,
  } = useEstadosPrioridades();
  const sensors = useDragSensors();

  const handleDragEndEstados = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = estados.findIndex((e) => e.id === active.id);
    const newIndex = estados.findIndex((e) => e.id === over.id);
    reorderEstados(arrayMove(estados, oldIndex, newIndex).map((e) => e.id));
  };

  const handleDragEndPrioridades = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = prioridades.findIndex((p) => p.id === active.id);
    const newIndex = prioridades.findIndex((p) => p.id === over.id);
    reorderPrioridades(arrayMove(prioridades, oldIndex, newIndex).map((p) => p.id));
  };

  const handleDragEndTipos = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = tipos.findIndex((t) => t.id === active.id);
    const newIndex = tipos.findIndex((t) => t.id === over.id);
    reorderTipos(arrayMove(tipos, oldIndex, newIndex).map((t) => t.id));
  };

  return (
    <div className="min-h-dvh bg-primero text-cuarto font-roboto">
      <AppHeader logoUrl={branding?.logoUrl} nombreMarca={branding?.nombreMarca}>
        <div className="flex items-center gap-[0.5em] sm:gap-[0.75em] min-w-0 flex-1">
          <button
            onClick={() => navigate('/tablero')}
            aria-label="Volver al tablero"
            className="w-[2.5em] h-[2.5em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-[0.85em]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-[0.85em] sm:text-[0.95em] font-semibold font-poppins text-cuarto tracking-tight truncate">
              Estados y Prioridades
            </h1>
            <p className="text-[0.75em] text-cuarto/60 mt-[0.1em] hidden sm:block">
              Personaliza los estados y prioridades disponibles en tu tablero
            </p>
          </div>
        </div>
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] py-[1em] sm:py-[1.5em] max-w-[48em] mx-auto flex flex-col gap-[2em]">
        {loading ? (
          <div className="flex items-center justify-center py-[6em]">
            <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <section className="flex flex-col gap-[0.75em]">
              <div className="flex items-center gap-[0.5em]">
                <FontAwesomeIcon icon={faListCheck} className="text-segundo/60 text-[0.9em]" />
                <h2 className="text-[0.85em] font-semibold font-poppins text-cuarto uppercase tracking-wider">Estados</h2>
                <span className="text-[0.75em] text-cuarto/30 font-roboto">({estados.length})</span>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndEstados}>
                <SortableContext items={estados.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                  <ul className="flex flex-col gap-[0.5em]">
                    {estados.map((estado) => (
                      <EstadoPrioridadItem
                        key={estado.id}
                        item={estado}
                        isEstado
                        nombreEntidad="el estado"
                        onUpdate={updateEstado}
                        onRemove={removeEstado}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>

              <CreateEstadoPrioridadForm isEstado onCreate={createEstado} placeholder="Nuevo estado..." />
            </section>

            <section className="flex flex-col gap-[0.75em]">
              <div className="flex items-center gap-[0.5em]">
                <FontAwesomeIcon icon={faFlag} className="text-segundo/60 text-[0.9em]" />
                <h2 className="text-[0.85em] font-semibold font-poppins text-cuarto uppercase tracking-wider">Prioridades</h2>
                <span className="text-[0.75em] text-cuarto/30 font-roboto">({prioridades.length})</span>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndPrioridades}>
                <SortableContext items={prioridades.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  <ul className="flex flex-col gap-[0.5em]">
                    {prioridades.map((prioridad) => (
                      <EstadoPrioridadItem
                        key={prioridad.id}
                        item={prioridad}
                        isEstado={false}
                        nombreEntidad="la prioridad"
                        onUpdate={updatePrioridad}
                        onRemove={removePrioridad}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>

              <CreateEstadoPrioridadForm isEstado={false} onCreate={createPrioridad} placeholder="Nueva prioridad..." />
            </section>

            <section className="flex flex-col gap-[0.75em]">
              <div className="flex items-center gap-[0.5em]">
                <FontAwesomeIcon icon={faLayerGroup} className="text-segundo/60 text-[0.9em]" />
                <h2 className="text-[0.85em] font-semibold font-poppins text-cuarto uppercase tracking-wider">Tipos</h2>
                <span className="text-[0.75em] text-cuarto/30 font-roboto">({tipos.length})</span>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndTipos}>
                <SortableContext items={tipos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <ul className="flex flex-col gap-[0.5em]">
                    {tipos.map((tipo) => (
                      <EstadoPrioridadItem
                        key={tipo.id}
                        item={tipo}
                        isEstado={false}
                        nombreEntidad="el tipo"
                        onUpdate={updateTipo}
                        onRemove={removeTipo}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>

              <CreateEstadoPrioridadForm isEstado={false} onCreate={createTipo} placeholder="Nuevo tipo..." />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ConfiguracionEstados;
