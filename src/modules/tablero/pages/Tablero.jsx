import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faFlag, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import AppHeader from '../../../components/AppHeader';
import Modal from '../../../components/Modal';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import SearchBar from '../../../components/SearchBar';
import FilterDropdown from '../../../components/FilterDropdown';
import CreateCategoryButton from '../components/CreateCategoryButton';
import CategoryForm, { CATEGORY_FORM_ID } from '../components/CategoryForm';
import ModalActions from '../../../components/ModalActions';
import CategoryCard from '../components/CategoryCard';
import SortableCategoryCard from '../components/SortableCategoryCard';
import EquipoModal from '../components/EquipoModal';
import { TableroSkeleton } from '../components/TableroSkeletons';
import usePermisosTablero from '../hooks/usePermisosTablero';
import useCategories from '../hooks/useCategories';
import useSearchSort from '../../../hooks/useSearchSort';
import useDragSensors from '../../../hooks/useDragSensors';
import useConfirmDelete from '../../../hooks/useConfirmDelete';
import { useBranding } from '../../../context/BrandingContext';
import { useAmbito } from '../../../context/AmbitoContext';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

function Tablero() {
  const { esPersonal, esDueno } = useAmbito();
  const { puedeGestionarEquipo } = usePermisosTablero();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creando, setCreando] = useState(false);
  const [isEquipoOpen, setIsEquipoOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [autoEditId] = useState(() => searchParams.get('editar'));
  const { branding } = useBranding();
  const { estados, prioridades } = useEstadosPrioridades();
  const { categories, loading, fetchCategories, createCategory, updateCategory, removeCategory, reorderCategories } = useCategories();
  const { isOpen: isDeleteOpen, confirming: deleting, requestRemove, cancelRemove, confirmRemove, pendingId: deletingId } = useConfirmDelete(removeCategory);
  const { result: filteredCategories, query, setQuery, sort, setSort, filters, setFilter, clearFilters, hasActiveFilters } = useSearchSort(categories, { persistKey: esPersonal ? 'categorias_personal' : 'categorias' });
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

  const cerrarCrear = () => setIsModalOpen(false);

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
          <div className="flex items-center gap-[0.5em]">
            <h1 className="text-[0.9em] sm:text-[1.05em] font-semibold font-poppins text-cuarto tracking-tight truncate">
              {!esPersonal ? 'Tablero de Requerimientos' : esDueno ? 'Mi tablero' : 'Tablero compartido'}
            </h1>
            {esPersonal && (
              <span className={`hidden sm:inline-flex items-center gap-[0.35em] px-[0.6em] py-[0.15em] rounded-full text-[0.7em] font-poppins font-medium flex-shrink-0 border ${esDueno ? 'bg-segundo/15 border-segundo/30 text-segundo' : 'bg-tercero/15 border-tercero/30 text-tercero'}`}>
                <FontAwesomeIcon icon={esDueno ? faUser : faUsers} className="text-[0.7em]" />
                {esDueno ? 'Personal' : 'Colaborador'}
              </span>
            )}
          </div>
          <p className="text-[0.75em] text-cuarto/60 mt-[0.1em] hidden sm:block">
            {!esPersonal
              ? 'Organiza y gestiona tus requerimientos por categorías'
              : esDueno
                ? 'Tu espacio privado, solo quien invites lo ve'
                : 'Colaboras aquí: solo puedes editar lo que tú creas'}
          </p>
        </div>
        {/* La navegación entre tableros vive en el sidebar y en /equipos. El
            header solo lleva acciones de ESTE tablero: gestionar el equipo (solo
            el dueño de su propio tablero personal). */}
        {puedeGestionarEquipo && (
          <button
            onClick={() => setIsEquipoOpen(true)}
            aria-label="Gestionar mi equipo"
            className="flex items-center gap-[0.4em] px-[0.75em] h-[2.25em] sm:h-[2.5em] rounded-[0.5em] flex-shrink-0 text-cuarto/60 font-poppins font-medium text-[0.8em] sm:text-[0.875em] whitespace-nowrap border border-cuarto/10 hover:border-segundo/40 hover:text-segundo transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
          >
            <FontAwesomeIcon icon={faUsers} className="text-[0.85em]" />
            <span className="hidden sm:inline">Equipo</span>
          </button>
        )}
        <CreateCategoryButton onClick={() => setIsModalOpen(true)} />
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] xl:px-[2em] py-[1em] sm:py-[1.5em]">
        {loading && (
          <TableroSkeleton etiqueta={!esPersonal ? 'Cargando el tablero' : esDueno ? 'Cargando tu tablero' : 'Cargando el tablero compartido'} />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[0.85em] sm:gap-[1em]">
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

      <Modal
        isOpen={isModalOpen}
        onClose={cerrarCrear}
        eyebrow="Tablero"
        title="Nueva categoría"
        icon={faTag}
        size="lg"
        footer={
          <ModalActions
            form={CATEGORY_FORM_ID}
            onCancel={cerrarCrear}
            confirmLabel="Crear categoría"
            loading={creando}
          />
        }
      >
        <CategoryForm onSubmit={handleCreate} onLoadingChange={setCreando} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        confirming={deleting}
        label={`la categoría "${categories.find((c) => c.id === deletingId)?.nombre ?? ''}"`}
        onCancel={cancelRemove}
        onConfirm={confirmRemove}
      />

      <EquipoModal isOpen={isEquipoOpen} onClose={() => setIsEquipoOpen(false)} />
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
