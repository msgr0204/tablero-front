import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faFlag, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import AppHeader from '../../../components/AppHeader';
import Modal from '../../../components/Modal';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import SearchBar from '../../../components/SearchBar';
import FilterDropdown from '../../../components/FilterDropdown';
import CreateCategoryButton from '../components/CreateCategoryButton';
import CategoryForm from '../components/CategoryForm';
import CategoryCard from '../components/CategoryCard';
import SortableCategoryCard from '../components/SortableCategoryCard';
import useCategories from '../hooks/useCategories';
import useSearchSort from '../../../hooks/useSearchSort';
import useDragSensors from '../../../hooks/useDragSensors';
import useConfirmDelete from '../../../hooks/useConfirmDelete';
import { useBranding } from '../../../context/BrandingContext';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

function Tablero() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [autoEditId] = useState(() => searchParams.get('editar'));
  const { branding } = useBranding();
  const { estados, prioridades } = useEstadosPrioridades();
  const { categories, loading, fetchCategories, createCategory, updateCategory, removeCategory, reorderCategories } = useCategories();
  const { isOpen: isDeleteOpen, confirming: deleting, requestRemove, cancelRemove, confirmRemove, pendingId: deletingId } = useConfirmDelete(removeCategory);
  const { result: filteredCategories, query, setQuery, sort, setSort, filters, setFilter, clearFilters, hasActiveFilters } = useSearchSort(categories);
  const isReorderDisabled = query.trim() !== '' || sort !== 'custom' || hasActiveFilters;
  const sensors = useDragSensors();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const limpiarAutoEdit = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('editar');
      return next;
    }, { replace: true });
  };

  const handleCreate = async (payload) => {
    await createCategory(payload);
    setIsModalOpen(false);
  };

  const handleDragStart = ({ active }) => {
    setActiveCategory(categories.find((c) => c.id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveCategory(null);
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    reorderCategories(arrayMove(categories, oldIndex, newIndex).map((c) => c.id));
  };

  return (
    <div className="min-h-dvh bg-primero text-cuarto font-roboto">
      <AppHeader logoUrl={branding?.logoUrl} nombreMarca={branding?.nombreMarca}>
        <div className="min-w-0 flex-1">
          <h1 className="text-[0.9em] sm:text-[1.05em] font-semibold font-poppins text-cuarto tracking-tight truncate">
            Tablero de Requerimientos
          </h1>
          <p className="text-[0.75em] text-cuarto/60 mt-[0.1em] hidden sm:block">
            Organiza y gestiona tus requerimientos por categorías
          </p>
        </div>
        <button
          onClick={() => navigate('/tablero/dashboard')}
          aria-label="Ver dashboard ejecutivo"
          className="flex items-center gap-[0.4em] px-[0.75em] h-[2.25em] sm:h-[2.5em] rounded-[0.5em] flex-shrink-0 text-cuarto/60 font-poppins font-medium text-[0.8em] sm:text-[0.875em] whitespace-nowrap border border-cuarto/10 hover:border-segundo/40 hover:text-segundo transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
        >
          <FontAwesomeIcon icon={faChartLine} className="text-[0.85em]" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
        <CreateCategoryButton onClick={() => setIsModalOpen(true)} />
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] py-[1em] sm:py-[1.5em]">
        {loading && (
          <div className="flex items-center justify-center py-[6em]">
            <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
          </div>
        )}

        {!loading && categories.length === 0 && <EmptyState onAction={() => setIsModalOpen(true)} />}

        {!loading && categories.length > 0 && (
          <>
            <SearchBar
              query={query}
              onQuery={setQuery}
              sort={sort}
              onSort={setSort}
              placeholder="Buscar categoría..."
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

            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[5em] gap-[0.5em]">
                <p className="text-[0.9em] text-cuarto/40 font-roboto">Sin resultados para "{query}"</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {isReorderDisabled && (
                  <p className="text-[0.75em] text-cuarto/40 font-roboto mb-[0.75em]">
                    Limpia los filtros y selecciona "Personalizado" para reordenar las categorías.
                  </p>
                )}
                <SortableContext items={filteredCategories.map((c) => c.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[0.85em] sm:gap-[1em]">
                    {filteredCategories.map((cat) => (
                      <SortableCategoryCard
                        key={cat.id}
                        category={cat}
                        onUpdate={updateCategory}
                        onRemove={requestRemove}
                        dragDisabled={isReorderDisabled}
                        autoEdit={cat.id === autoEditId}
                        onAutoEditDone={limpiarAutoEdit}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
                  {activeCategory && (
                    <div className="rotate-1 scale-105 shadow-2xl shadow-primero-oscuro/60 rounded-[0.85em] opacity-95">
                      <CategoryCard category={activeCategory} onUpdate={() => {}} onRemove={() => {}} />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva categoría">
        <CategoryForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        confirming={deleting}
        label={`la categoría "${categories.find((c) => c.id === deletingId)?.nombre ?? ''}"`}
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
        aria-label="Crear primera categoría"
        className="w-[4em] h-[4em] rounded-[1em] bg-segundo/10 border border-segundo/20 flex items-center justify-center hover:bg-segundo/20 hover:border-segundo/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
      >
        <span className="text-segundo text-[1.75em] font-poppins font-bold leading-none">+</span>
      </button>
      <div className="text-center">
        <p className="text-[0.9em] font-medium text-cuarto/70 font-poppins">Sin categorías aún</p>
        <p className="text-[0.8em] text-cuarto/40 mt-[0.25em]">Crea tu primera categoría para comenzar</p>
      </div>
      <button
        onClick={onAction}
        className="px-[1em] h-[2.25em] rounded-[0.5em] text-[0.8em] font-semibold font-poppins bg-segundo/10 border border-segundo/25 text-segundo hover:bg-segundo/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
      >
        + Crear categoría
      </button>
    </div>
  );
}

export default Tablero;
