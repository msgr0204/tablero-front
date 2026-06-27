import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCubes, faTag, faFlag } from '@fortawesome/free-solid-svg-icons';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import AppHeader from '../../../components/AppHeader';
import Modal from '../../../components/Modal';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import SearchBar from '../../../components/SearchBar';
import FilterDropdown from '../../../components/FilterDropdown';
import CreateModuleButton from '../components/CreateModuleButton';
import ModuleForm from '../components/ModuleForm';
import ModuleCard from '../components/ModuleCard';
import SortableModuleCard from '../components/SortableModuleCard';
import useModules from '../hooks/useModules';
import useCategory from '../hooks/useCategory';
import useSearchSort from '../../../hooks/useSearchSort';
import useDragSensors from '../../../hooks/useDragSensors';
import useConfirmDelete from '../../../hooks/useConfirmDelete';
import { useBranding } from '../../../context/BrandingContext';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

function ModulosCategoria() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const { branding } = useBranding();
  const { estados, prioridades } = useEstadosPrioridades();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const { category: categoria, fetchCategory } = useCategory(categoriaId);
  const { modules, loading, fetchModules, createModule, updateModule, removeModule, reorderModules } = useModules(categoriaId);
  const { isOpen: isDeleteOpen, confirming: deleting, requestRemove, cancelRemove, confirmRemove, pendingId: deletingId } = useConfirmDelete(removeModule);
  const { result: filteredModules, query, setQuery, sort, setSort, filters, setFilter, clearFilters, hasActiveFilters } = useSearchSort(modules);
  const isReorderDisabled = query.trim() !== '' || sort !== 'custom' || hasActiveFilters;
  const sensors = useDragSensors();

  useEffect(() => {
    fetchCategory().then((found) => {
      if (!found) navigate('/tablero', { replace: true });
    });
    fetchModules();
  }, [categoriaId, fetchCategory, fetchModules, navigate]);

  const handleCreateModule = async (payload) => {
    await createModule(payload);
    setIsCreateOpen(false);
  };

  const handleViewModule = (mod) => {
    navigate(`/tablero/${categoriaId}/modulos/${mod.id}`);
  };

  const handleUpdateModule = async (payload) => {
    await updateModule(editingModule.id, payload);
    setEditingModule(null);
  };

  const handleDragStart = ({ active }) => {
    setActiveModule(modules.find((m) => m.id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveModule(null);
    if (!over || active.id === over.id) return;
    const oldIndex = modules.findIndex((m) => m.id === active.id);
    const newIndex = modules.findIndex((m) => m.id === over.id);
    reorderModules(arrayMove(modules, oldIndex, newIndex).map((m) => m.id));
  };

  return (
    <div className="min-h-dvh bg-primero text-cuarto font-roboto">
      <AppHeader logoUrl={branding?.logoUrl} nombreMarca={branding?.nombreMarca}>
        <div className="flex items-center gap-[0.5em] sm:gap-[0.75em] min-w-0">
          <button
            onClick={() => navigate('/tablero')}
            aria-label="Volver a categorías"
            className="w-[2.5em] h-[2.5em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-[0.85em]" />
          </button>
          <div className="min-w-0 flex-1">
            <span className="text-[0.75em] text-segundo/60 font-roboto font-medium truncate block max-w-[8em] sm:max-w-none">
              {categoria?.nombre ?? '...'}
            </span>
            <h1 className="text-[0.85em] sm:text-[0.95em] font-semibold font-poppins text-cuarto tracking-tight leading-tight">
              Módulos
            </h1>
          </div>
        </div>
        <CreateModuleButton onClick={() => setIsCreateOpen(true)} />
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] py-[1em] sm:py-[1.5em]">
        {loading && (
          <div className="flex items-center justify-center py-[6em]">
            <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
          </div>
        )}

        {!loading && modules.length === 0 && <EmptyState onAction={() => setIsCreateOpen(true)} />}

        {!loading && modules.length > 0 && (
          <>
            <SearchBar
              query={query}
              onQuery={setQuery}
              sort={sort}
              onSort={setSort}
              placeholder="Buscar módulo..."
              hasExtraFilters={hasActiveFilters}
              onClearExtraFilters={clearFilters}
            >
              <FilterDropdown
                icon={faTag}
                value={filters.estado ?? ''}
                onChange={(v) => setFilter('estado', v)}
                placeholder="Estado"
                options={[{ value: '', label: 'Todos los estados' }, ...estados.map((e) => ({ value: e.id, label: e.label }))]}
              />
              <FilterDropdown
                icon={faFlag}
                value={filters.prioridad ?? ''}
                onChange={(v) => setFilter('prioridad', v)}
                placeholder="Prioridad"
                options={[{ value: '', label: 'Todas las prioridades' }, ...prioridades.map((p) => ({ value: p.id, label: p.label }))]}
              />
            </SearchBar>

            {filteredModules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[5em] gap-[0.5em]">
                <p className="text-[0.9em] text-cuarto/40 font-roboto">Sin resultados para "{query}"</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {isReorderDisabled && (
                  <p className="text-[0.75em] text-cuarto/40 font-roboto mb-[0.75em]">
                    Limpia los filtros y selecciona "Personalizado" para reordenar los módulos.
                  </p>
                )}
                <SortableContext items={filteredModules.map((m) => m.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[0.85em] sm:gap-[1.25em]">
                    {filteredModules.map((mod) => (
                      <SortableModuleCard
                        key={mod.id}
                        module={mod}
                        onView={handleViewModule}
                        onEdit={setEditingModule}
                        onRemove={requestRemove}
                        dragDisabled={isReorderDisabled}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
                  {activeModule && (
                    <div className="rotate-1 scale-105 shadow-2xl shadow-primero-oscuro/60 rounded-[0.85em] opacity-95">
                      <ModuleCard module={activeModule} onView={() => {}} onEdit={() => {}} onRemove={() => {}} />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </>
        )}
      </main>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nuevo módulo">
        <ModuleForm onSubmit={handleCreateModule} onCancel={() => setIsCreateOpen(false)} />
      </Modal>

      <Modal isOpen={Boolean(editingModule)} onClose={() => setEditingModule(null)} title="Editar módulo">
        {editingModule && (
          <ModuleForm
            initialValues={editingModule}
            onSubmit={handleUpdateModule}
            onCancel={() => setEditingModule(null)}
          />
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        confirming={deleting}
        label={`el módulo "${modules.find((m) => m.id === deletingId)?.nombre ?? ''}"`}
        onCancel={cancelRemove}
        onConfirm={confirmRemove}
      />
    </div>
  );
}

function EmptyState({ onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-[6em] gap-[1em]">
      <button
        onClick={onAction}
        aria-label="Crear primer módulo"
        className="w-[4em] h-[4em] rounded-[1em] bg-segundo/10 border border-segundo/20 flex items-center justify-center hover:bg-segundo/20 hover:border-segundo/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
      >
        <FontAwesomeIcon icon={faCubes} className="text-segundo text-[1.5em]" />
      </button>
      <div className="text-center">
        <p className="text-[0.9em] font-medium text-cuarto/70 font-poppins">Sin módulos aún</p>
        <p className="text-[0.8em] text-cuarto/40 mt-[0.25em]">Crea el primer módulo para esta categoría</p>
      </div>
      <button
        onClick={onAction}
        className="px-[1em] h-[2.25em] rounded-[0.5em] text-[0.8em] font-semibold font-poppins bg-segundo/10 border border-segundo/25 text-segundo hover:bg-segundo/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
      >
        + Crear módulo
      </button>
    </div>
  );
}

export default ModulosCategoria;
