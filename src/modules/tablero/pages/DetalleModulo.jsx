import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCubes, faListCheck, faCommentDots, faPen, faMagnifyingGlass, faTag, faFlag, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AppHeader from '../../../components/AppHeader';
import Modal from '../../../components/Modal';
import Badge from '../../../components/Badge';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import FilterDropdown from '../../../components/FilterDropdown';
import ModuleForm from '../components/ModuleForm';
import ObservationList from '../components/ObservationList';
import AddRequirementInline from '../components/AddRequirementInline';
import RequirementItem from '../components/RequirementItem';
import CompletedRequirementItem from '../components/CompletedRequirementItem';
import RequirementAttachments from '../components/RequirementAttachments';
import useModuleDetail from '../hooks/useModuleDetail';
import useSearchSort from '../../../hooks/useSearchSort';
import useDragSensors from '../../../hooks/useDragSensors';
import useConfirmDelete from '../../../hooks/useConfirmDelete';
import { useBranding } from '../../../context/BrandingContext';
import { useEstadosPrioridades } from '../contexts/EstadosPrioridadesContext';

function DetalleModulo() {
  const { categoriaId, moduloId } = useParams();
  const navigate = useNavigate();
  const { branding } = useBranding();
  const { estados, prioridades, tipos, getEstado, getPrioridad, getTipo } = useEstadosPrioridades();
  const sensors = useDragSensors();
  const {
    module, loading, fetchModule, updateDetail,
    addRequirement, updateRequirement, removeRequirement, reorderRequirements, toggleCompletado,
    addModuleObservation, removeModuleObservation, addReqObservation, removeReqObservation,
    addAdjunto, removeAdjunto,
  } = useModuleDetail(moduloId);
  const { isOpen: isDeleteOpen, confirming: deleting, requestRemove, cancelRemove, confirmRemove, pendingId: deletingId } = useConfirmDelete(removeRequirement);

  const [activeReqId, setActiveReqId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [activeTab, setActiveTab] = useState('detalle');

  useEffect(() => {
    fetchModule().then((found) => {
      if (!found) navigate(`/tablero/${categoriaId}/modulos`, { replace: true });
    });
  }, [fetchModule, categoriaId, navigate]);

  const reqs = module?.requerimientos ?? [];
  const { result: filteredReqs, query, setQuery, filters, setFilter, hasActiveFilters } = useSearchSort(reqs, { searchKey: 'texto' });

  if (loading || !module) {
    return (
      <div className="min-h-dvh bg-primero flex items-center justify-center">
        <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
      </div>
    );
  }

  const isReqFilterActive = query.trim() !== '' || hasActiveFilters;
  const pendientes = filteredReqs.filter((r) => !r.completado);
  const completados = filteredReqs.filter((r) => r.completado);
  const activeReq = reqs.find((r) => r.id === activeReqId);
  const selectedReq = reqs.find((r) => r.id === selectedReqId) ?? null;

  const handleUpdateModule = async (payload) => {
    await updateDetail(payload);
    setIsEditOpen(false);
  };

  const handleSelectReq = (reqId) => {
    setSelectedReqId((prev) => (prev === reqId ? null : reqId));
    setActiveTab('detalle');
  };

  const handleVolver = () => {
    navigate(`/tablero/${categoriaId}/modulos`);
  };

  const handleDragStart = ({ active }) => setActiveReqId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveReqId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = pendientes.findIndex((r) => r.id === active.id);
    const newIndex = pendientes.findIndex((r) => r.id === over.id);
    const reordered = arrayMove(pendientes, oldIndex, newIndex);
    reorderRequirements([...reordered.map((r) => r.id), ...completados.map((r) => r.id)]);
  };

  return (
    <div className="min-h-dvh bg-primero text-cuarto font-roboto">
      <AppHeader logoUrl={branding?.logoUrl} nombreMarca={branding?.nombreMarca}>
        <div className="flex items-center gap-[0.5em] sm:gap-[0.75em] min-w-0">
          <button
            onClick={handleVolver}
            aria-label="Volver a módulos"
            className="w-[2.5em] h-[2.5em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-[0.85em]" />
          </button>
          <div className="min-w-0 flex-1">
            <span className="text-[0.75em] text-segundo/60 font-roboto font-medium truncate block max-w-[10em] sm:max-w-none">
              {module.nombre}
            </span>
            <h1 className="text-[0.85em] sm:text-[0.95em] font-semibold font-poppins text-cuarto tracking-tight leading-tight">
              Detalle del módulo
            </h1>
          </div>
        </div>
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] py-[1.25em] sm:py-[1.75em] max-w-[90em] mx-auto flex flex-col gap-[1.5em]">

        <section className="bg-primero-claro border border-cuarto/10 rounded-[1em] px-[1em] py-[0.6em] flex items-center justify-between gap-[1em]">
          <div className="flex items-center gap-[0.6em] min-w-0">
            <FontAwesomeIcon icon={faCubes} className="text-segundo/60 text-[0.85em] flex-shrink-0" />
            <h2 className="text-[0.9em] font-bold font-poppins text-cuarto truncate">{module.nombre}</h2>
            <Badge config={getEstado(module.estado)} size="sm" />
            <Badge config={getPrioridad(module.prioridad)} size="sm" />
          </div>
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex-shrink-0 flex items-center gap-[0.4em] px-[0.7em] h-[1.85em] rounded-[0.5em] text-[0.75em] font-semibold font-poppins bg-segundo/10 border border-segundo/25 text-segundo hover:bg-segundo/20 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50"
          >
            <FontAwesomeIcon icon={faPen} className="text-[0.75em]" />
            Editar módulo
          </button>
        </section>

        {/* Body: 2 columnas amplias */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-[1.5em]">

          {/* Columna izquierda: requerimientos */}
          <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] flex flex-col overflow-hidden">
            <div className="flex items-center gap-[0.5em] px-[1.25em] sm:px-[1.5em] py-[1em] border-b border-cuarto/10 flex-shrink-0">
              <FontAwesomeIcon icon={faListCheck} className="text-segundo/60 text-[0.9em]" />
              <span className="text-[0.85em] font-semibold text-cuarto font-poppins uppercase tracking-wider">Requerimientos</span>
              <span className="ml-auto text-[0.85em] text-segundo/70 font-poppins font-semibold">{pendientes.length} pendientes</span>
            </div>

            <AddRequirementInline onAdd={addRequirement} draftKey={`req_inline_${module.id}`} />

            <div className="flex items-center gap-[0.5em] px-[1.25em] sm:px-[1.5em] py-[0.85em] border-b border-cuarto/10 flex-shrink-0 flex-wrap">
              <div className="relative flex-1 min-w-[9em]">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-[0.85em] top-1/2 -translate-y-1/2 text-cuarto/30 text-[0.8em] pointer-events-none"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar requerimiento..."
                  className="w-full h-[2.5em] pl-[2.25em] pr-[1em] rounded-[0.5em] bg-primero-claro/60 border border-cuarto/10 hover:border-cuarto/20 text-cuarto placeholder:text-cuarto/30 font-roboto text-[0.9em] outline-none focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40 transition-all duration-200"
                />
              </div>
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
              <FilterDropdown
                icon={faLayerGroup}
                value={filters.tipo ?? ''}
                onChange={(v) => setFilter('tipo', v)}
                placeholder="Tipo"
                options={[{ value: '', label: 'Todos los tipos' }, ...tipos.map((t) => ({ value: t.id, label: t.label }))]}
              />
            </div>

            <div className="flex-1 max-h-[40em] overflow-y-auto px-[1.25em] sm:px-[1.5em] py-[1.25em] flex flex-col gap-[1.25em]">
              {reqs.length === 0 ? (
                <div className="flex items-center justify-center h-[8em] border border-dashed border-cuarto/15 rounded-[0.6em]">
                  <p className="text-[0.85em] text-cuarto/25 italic font-roboto">Sin requerimientos</p>
                </div>
              ) : pendientes.length === 0 && completados.length === 0 ? (
                <div className="flex items-center justify-center h-[8em] border border-dashed border-cuarto/15 rounded-[0.6em]">
                  <p className="text-[0.85em] text-cuarto/25 italic font-roboto">Sin resultados para "{query}"</p>
                </div>
              ) : (
                <>
                  {isReqFilterActive && (
                    <p className="text-[0.75em] text-cuarto/40 font-roboto">
                      Limpia la búsqueda y los filtros para reordenar los requerimientos.
                    </p>
                  )}

                  {pendientes.length > 0 && (
                    isReqFilterActive ? (
                      <ul className="flex flex-col gap-[0.6em]">
                        {pendientes.map((req, index) => (
                          <RequirementItem
                            key={req.id}
                            req={req}
                            index={index}
                            onUpdate={updateRequirement}
                            onRemove={requestRemove}
                            onAddObs={addReqObservation}
                            onToggle={toggleCompletado}
                            selected={selectedReqId === req.id}
                            onSelect={handleSelectReq}
                          />
                        ))}
                      </ul>
                    ) : (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <SortableContext items={pendientes.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                          <ul className="flex flex-col gap-[0.6em]">
                            {pendientes.map((req, index) => (
                              <RequirementItem
                                key={req.id}
                                req={req}
                                index={index}
                                onUpdate={updateRequirement}
                                onRemove={requestRemove}
                                onAddObs={addReqObservation}
                                onToggle={toggleCompletado}
                                selected={selectedReqId === req.id}
                                onSelect={handleSelectReq}
                              />
                            ))}
                          </ul>
                        </SortableContext>
                        <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
                          {activeReq && (
                            <div className="bg-primero-claro border border-segundo/40 rounded-[0.6em] px-[0.85em] py-[0.7em] shadow-xl opacity-90">
                              <p className="text-[0.9em] text-cuarto/80 font-roboto">{activeReq.texto}</p>
                            </div>
                          )}
                        </DragOverlay>
                      </DndContext>
                    )
                  )}

                  {completados.length > 0 && (
                    <div className="flex flex-col gap-[0.6em]">
                      <div className="flex items-center gap-[0.5em]">
                        <div className="flex-1 h-px bg-cuarto/10" />
                        <span className="text-[0.75em] text-cuarto/30 font-roboto px-[0.5em]">
                          Completados ({completados.length})
                        </span>
                        <div className="flex-1 h-px bg-cuarto/10" />
                      </div>
                      <ul className="flex flex-col gap-[0.6em]">
                        {completados.map((req, index) => (
                          <CompletedRequirementItem key={req.id} req={req} index={index} onRemove={requestRemove} onToggle={toggleCompletado} />
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Columna derecha: tabs de detalle de requerimiento / observaciones generales */}
          <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] flex flex-col overflow-hidden">
            <div className="flex items-center gap-[0.5em] px-[1.25em] sm:px-[1.5em] py-[0.85em] border-b border-cuarto/10 flex-shrink-0">
              <button
                onClick={() => setActiveTab('detalle')}
                className={`flex-1 flex items-center justify-center gap-[0.5em] h-[2.25em] rounded-[0.5em] text-[0.8em] font-semibold font-poppins transition-all duration-200 ${activeTab === 'detalle' ? 'bg-segundo/15 text-segundo border border-segundo/30' : 'text-cuarto/40 hover:text-cuarto/60 border border-transparent'}`}
              >
                <FontAwesomeIcon icon={faListCheck} className="text-[0.85em]" />
                Detalle requerimiento
              </button>
              <button
                onClick={() => setActiveTab('generales')}
                className={`flex-1 flex items-center justify-center gap-[0.5em] h-[2.25em] rounded-[0.5em] text-[0.8em] font-semibold font-poppins transition-all duration-200 ${activeTab === 'generales' ? 'bg-segundo/15 text-segundo border border-segundo/30' : 'text-cuarto/40 hover:text-cuarto/60 border border-transparent'}`}
              >
                <FontAwesomeIcon icon={faCommentDots} className="text-[0.85em]" />
                Observaciones generales
              </button>
            </div>

            <div className="flex-1 max-h-[40em] overflow-y-auto px-[1.25em] sm:px-[1.5em] py-[1.25em]">
              {activeTab === 'detalle' ? (
                selectedReq ? (
                  <div className="flex flex-col gap-[1em]">
                    <div>
                      <p className="text-[0.95em] text-cuarto/80 font-roboto leading-snug">{selectedReq.texto}</p>
                      <div className="flex items-center gap-[0.4em] flex-wrap mt-[0.4em]">
                        <Badge config={getEstado(selectedReq.estado)} size="sm" />
                        <Badge config={getPrioridad(selectedReq.prioridad)} size="sm" />
                        <Badge config={getTipo(selectedReq.tipo)} size="sm" />
                      </div>
                    </div>
                    <div className="h-px bg-cuarto/10" />
                    <RequirementAttachments
                      adjuntos={selectedReq.adjuntos ?? []}
                      onAdd={(archivo) => addAdjunto(selectedReq.id, archivo)}
                      onRemove={(adjuntoId) => removeAdjunto(selectedReq.id, adjuntoId)}
                    />
                    <div className="h-px bg-cuarto/10" />
                    <div>
                      <p className="text-[0.75em] font-semibold text-cuarto/40 font-poppins uppercase tracking-wider mb-[0.75em]">
                        Observaciones ({(selectedReq.observaciones ?? []).length})
                      </p>
                      <ObservationList
                        observaciones={selectedReq.observaciones ?? []}
                        onRemove={(obsId) => removeReqObservation(selectedReq.id, obsId)}
                        hideInput
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[8em] border border-dashed border-cuarto/15 rounded-[0.6em]">
                    <p className="text-[0.85em] text-cuarto/25 italic font-roboto">Selecciona un requerimiento para ver su detalle</p>
                  </div>
                )
              ) : (
                <ObservationList
                  observaciones={module.observaciones ?? []}
                  onAdd={addModuleObservation}
                  onRemove={removeModuleObservation}
                  draftKey={`obs_modulo_${module.id}`}
                />
              )}
            </div>
          </div>

        </section>
      </main>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar módulo">
        <ModuleForm
          initialValues={module}
          onSubmit={handleUpdateModule}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        confirming={deleting}
        label={`el requerimiento "${reqs.find((r) => r.id === deletingId)?.texto ?? ''}"`}
        onCancel={cancelRemove}
        onConfirm={confirmRemove}
      />
    </div>
  );
}

export default DetalleModulo;
