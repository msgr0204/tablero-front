import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faClockRotateLeft, faSearch, faUser, faFilter, faXmark,
  faLayerGroup, faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import AppHeader from '../../../components/AppHeader';
import Select from '../../../components/Select';
import EmptyState from '../../../components/EmptyState';
import { Esqueleto } from '../../../components/Skeleton';
import EntradaAuditoria from '../components/EntradaAuditoria';
import useAuditoria from '../hooks/useAuditoria';
import useDraft from '../../../hooks/useDraft';
import auditoriaService from '../services/auditoriaService';
import { ACCIONES_DISPONIBLES, ENTIDADES_DISPONIBLES } from '../lib/descripcion';
import { useBranding } from '../../../context/BrandingContext';

const TODOS = '';

function Auditoria() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  // La pestaña se recuerda entre visitas, como en el resto del tablero.
  const [tab, setTab] = useDraft('auditoria_tab', 'general');
  const [actores, setActores] = useState([]);
  const [filtros, setFiltros] = useState({ actor_id: TODOS, accion: TODOS, entidad: TODOS, texto: '' });
  const [pagina, setPagina] = useState(1);
  const { items, meta, loading, error, cargar } = useAuditoria();

  useEffect(() => {
    auditoriaService.actores().then(setActores).catch(() => setActores([]));
  }, []);

  // En "Mi actividad" el filtro por persona no aplica: ya está fijado al usuario.
  const params = useMemo(() => {
    const p = { pagina, porPagina: 30 };
    if (filtros.accion) p.accion = filtros.accion;
    if (filtros.entidad) p.entidad = filtros.entidad;
    if (filtros.texto.trim()) p.texto = filtros.texto.trim();
    if (tab === 'general' && filtros.actor_id) p.actor_id = filtros.actor_id;
    return p;
  }, [filtros, pagina, tab]);

  useEffect(() => {
    cargar(params, tab === 'mias');
  }, [cargar, params, tab]);

  const setFiltro = (campo) => (valor) => {
    setFiltros((f) => ({ ...f, [campo]: valor }));
    setPagina(1);
  };

  const hayFiltros = Boolean(
    filtros.accion || filtros.entidad || filtros.texto.trim() || (tab === 'general' && filtros.actor_id)
  );

  const limpiar = () => {
    setFiltros({ actor_id: TODOS, accion: TODOS, entidad: TODOS, texto: '' });
    setPagina(1);
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
          <h1 className="text-[0.85em] sm:text-[0.95em] font-semibold font-poppins text-cuarto tracking-tight truncate">
            Auditoría
          </h1>
        </div>
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] xl:px-[2em] py-[1.25em] sm:py-[1.75em] flex flex-col gap-[1.25em]">
        <div className="flex items-center gap-[0.85em]">
          <div className="w-[3em] h-[3em] rounded-[0.9em] bg-segundo/10 border border-segundo/25 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faClockRotateLeft} className="text-segundo text-[1.15em]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[1.15em] sm:text-[1.3em] font-bold font-poppins text-cuarto tracking-tight leading-tight">
              Registro de actividad
            </h2>
            <p className="text-[0.8em] text-cuarto/50 font-roboto mt-[0.15em]">
              Todo lo que ocurre en el tablero, con su autor y su momento
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[0.4em] p-[0.25em] rounded-[0.6em] bg-primero-claro border border-cuarto/10 w-fit">
          <TabAuditoria label="Todo el equipo" activo={tab === 'general'} onClick={() => { setTab('general'); setPagina(1); }} />
          <TabAuditoria label="Mi actividad" activo={tab === 'mias'} onClick={() => { setTab('mias'); setPagina(1); }} />
        </div>

        <div className="rounded-[1em] border border-cuarto/10 bg-primero-claro p-[1em]">
          <div className="flex flex-col gap-[0.85em] xl:flex-row xl:items-end">
            <div className={`grid flex-1 grid-cols-1 gap-[0.85em] md:grid-cols-2 ${tab === 'general' ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
              <FiltroLabel icon={faSearch} texto="Buscar">
                <div className="flex h-[2.75em] items-center gap-[0.6em] rounded-[0.6em] border border-cuarto/10 bg-primero-claro/60 px-[0.85em] text-[0.9em] transition focus-within:border-segundo/60 focus-within:ring-1 focus-within:ring-segundo/40">
                  <FontAwesomeIcon icon={faSearch} className="text-[0.8em] text-segundo/70 flex-shrink-0" />
                  <input
                    type="text"
                    value={filtros.texto}
                    onChange={(e) => setFiltro('texto')(e.target.value)}
                    placeholder="Nombre del ítem o persona"
                    className="min-w-0 flex-1 bg-transparent font-roboto text-cuarto placeholder:text-cuarto/30 outline-none"
                  />
                  {filtros.texto && (
                    <button
                      type="button"
                      onClick={() => setFiltro('texto')('')}
                      aria-label="Limpiar búsqueda"
                      className="text-cuarto/40 hover:text-cuarto transition-colors flex-shrink-0"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-[0.85em]" />
                    </button>
                  )}
                </div>
              </FiltroLabel>

              {tab === 'general' && (
                <FiltroLabel icon={faUser} texto="Persona">
                  <Select
                    value={filtros.actor_id}
                    onChange={setFiltro('actor_id')}
                    options={[
                      { value: TODOS, label: 'Todas las personas' },
                      ...actores.map((a) => ({ value: a.id, label: a.nombre ?? 'Sin nombre' })),
                    ]}
                  />
                </FiltroLabel>
              )}

              <FiltroLabel icon={faFilter} texto="Acción">
                <Select
                  value={filtros.accion}
                  onChange={setFiltro('accion')}
                  options={[{ value: TODOS, label: 'Todas las acciones' }, ...ACCIONES_DISPONIBLES]}
                />
              </FiltroLabel>

              <FiltroLabel icon={faLayerGroup} texto="Tipo">
                <Select
                  value={filtros.entidad}
                  onChange={setFiltro('entidad')}
                  options={[{ value: TODOS, label: 'Todos los tipos' }, ...ENTIDADES_DISPONIBLES]}
                />
              </FiltroLabel>
            </div>

            {hayFiltros && (
              <button
                type="button"
                onClick={limpiar}
                className="inline-flex h-[2.75em] items-center justify-center gap-[0.5em] rounded-[0.6em] border border-segundo/30 bg-segundo/10 px-[1.25em] text-[0.85em] font-bold font-poppins text-segundo hover:border-segundo/60 hover:bg-segundo/15 transition flex-shrink-0"
              >
                <FontAwesomeIcon icon={faXmark} className="text-[0.85em]" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <FeedSkeleton />
        ) : error ? (
          <EmptyState icon={faClockRotateLeft} titulo="No se pudo cargar la auditoría" descripcion={error} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={faClockRotateLeft}
            titulo={hayFiltros ? 'Sin resultados' : 'Aún no hay actividad registrada'}
            descripcion={hayFiltros
              ? 'Ninguna acción coincide con esos filtros.'
              : 'A medida que el equipo trabaje en el tablero, aquí quedará el registro de cada movimiento.'}
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[0.8em] text-cuarto/40 font-roboto">
                {meta.total} movimiento{meta.total === 1 ? '' : 's'}
              </span>
              {meta.totalPaginas > 1 && (
                <div className="flex items-center gap-[0.5em]">
                  <BotonPagina icon={faChevronLeft} disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)} label="Anterior" />
                  <span className="text-[0.8em] text-cuarto/50 font-roboto tabular-nums">{pagina} / {meta.totalPaginas}</span>
                  <BotonPagina icon={faChevronRight} disabled={pagina >= meta.totalPaginas} onClick={() => setPagina((p) => p + 1)} label="Siguiente" />
                </div>
              )}
            </div>

            <ul className="flex flex-col gap-[0.6em]">
              {items.map((entrada) => (
                <EntradaAuditoria key={entrada._id} entrada={entrada} />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

function TabAuditoria({ label, activo, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={[
        'px-[0.9em] h-[2.25em] rounded-[0.5em] text-[0.8em] font-poppins font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50',
        activo ? 'bg-segundo/15 text-segundo border border-segundo/30' : 'text-cuarto/50 hover:text-cuarto/80 border border-transparent',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function FiltroLabel({ icon, texto, children }) {
  return (
    <label className="min-w-0">
      <span className="mb-[0.4em] flex items-center gap-[0.4em] text-[0.7em] font-bold uppercase tracking-[0.12em] text-cuarto/40 font-poppins">
        <FontAwesomeIcon icon={icon} className="text-segundo/70" />
        {texto}
      </span>
      {children}
    </label>
  );
}

function BotonPagina({ icon, disabled, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="w-[2em] h-[2em] flex items-center justify-center rounded-[0.5em] border border-cuarto/10 text-cuarto/50 hover:text-segundo hover:border-segundo/40 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
    >
      <FontAwesomeIcon icon={icon} className="text-[0.75em]" />
    </button>
  );
}

function FeedSkeleton() {
  return (
    <Esqueleto etiqueta="Cargando la actividad" className="flex flex-col gap-[0.6em]">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-[0.85em] rounded-[0.75em] border border-cuarto/10 bg-primero-claro/40 p-[0.85em]">
          <span className="tq-shimmer block w-[2.25em] h-[2.25em] rounded-[0.6em] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-[0.4em]">
            <span className="tq-shimmer block w-[70%] h-[0.9em] rounded-[0.4em]" />
            <span className="tq-shimmer block w-[35%] h-[0.7em] rounded-[0.4em]" />
          </div>
        </div>
      ))}
    </Esqueleto>
  );
}

export default Auditoria;
