import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faUserPlus, faUsers, faSearch, faUserShield, faFilter, faXmark,
  faPen, faTrash, faBriefcase, faEnvelope, faPhone, faLocationDot, faIdCard,
} from '@fortawesome/free-solid-svg-icons';
import AppHeader from '../../../components/AppHeader';
import EmptyState from '../../../components/EmptyState';
import { Esqueleto } from '../../../components/Skeleton';
import Modal from '../../../components/Modal';
import Select from '../../../components/Select';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import UsuarioForm from '../components/UsuarioForm';
import useUsuarios from '../hooks/useUsuarios';
import useConfirmDelete from '../../../hooks/useConfirmDelete';
import { useAuth } from '../../../context/AuthContext';
import { useBranding } from '../../../context/BrandingContext';

const ROL_LABEL = { admin: 'Administrador', miembro: 'Miembro' };
const TODOS = '__todos__';

// Búsqueda sin depender de tildes ni mayúsculas: "gomez" encuentra "Gómez".
const normalizar = (v) => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function GestionUsuarios() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const { usuario: usuarioActual } = useAuth();
  const { usuarios, loading, fetchUsuarios, createUsuario, updateUsuario, removeUsuario } = useUsuarios();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState(TODOS);
  const [filtroEstado, setFiltroEstado] = useState(TODOS);
  const { isOpen: isDeleteOpen, confirming: deleting, requestRemove, cancelRemove, confirmRemove, pendingId: deletingId } = useConfirmDelete(removeUsuario);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleCreate = async (payload) => {
    await createUsuario(payload);
    setIsCreateOpen(false);
  };

  const handleUpdate = async (payload) => {
    await updateUsuario(editingUsuario.id, payload);
    setEditingUsuario(null);
  };

  const visibles = useMemo(() => {
    const q = normalizar(busqueda).trim();
    return usuarios.filter((u) => {
      const activo = u.activo !== false;
      if (filtroEstado === 'activo' && !activo) return false;
      if (filtroEstado === 'inactivo' && activo) return false;
      if (filtroRol !== TODOS && u.rol !== filtroRol) return false;
      if (!q) return true;
      return [u.nombre, u.email, u.documento, u.telefono, u.cargo].some((c) => normalizar(c).includes(q));
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  const hayFiltros = Boolean(busqueda.trim()) || filtroRol !== TODOS || filtroEstado !== TODOS;
  const limpiar = () => { setBusqueda(''); setFiltroRol(TODOS); setFiltroEstado(TODOS); };

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
            Gestión de usuarios
          </h1>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-[0.4em] px-[0.85em] h-[2.25em] sm:h-[2.5em] rounded-[0.5em] flex-shrink-0 bg-segundo text-primero-oscuro font-poppins font-semibold text-[0.8em] sm:text-[0.875em] whitespace-nowrap hover:bg-segundo-claro active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/60"
        >
          <FontAwesomeIcon icon={faUserPlus} className="text-[0.8em]" />
          <span className="hidden sm:inline">Nuevo usuario</span>
        </button>
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] xl:px-[2em] py-[1.25em] sm:py-[1.75em] flex flex-col gap-[1.25em]">

        {/* Encabezado de sección */}
        <div className="flex items-center gap-[0.85em]">
          <div className="w-[3em] h-[3em] rounded-[0.9em] bg-segundo/10 border border-segundo/25 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faUsers} className="text-segundo text-[1.15em]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[1.15em] sm:text-[1.3em] font-bold font-poppins text-cuarto tracking-tight leading-tight">
              Usuarios del sistema
            </h2>
            <p className="text-[0.8em] text-cuarto/50 font-roboto mt-[0.15em]">
              Personal del equipo, sus roles y datos de contacto
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="rounded-[1em] border border-cuarto/10 bg-primero-claro p-[1em]">
          <div className="flex flex-col gap-[0.85em] xl:flex-row xl:items-end">
            <div className="grid flex-1 grid-cols-1 gap-[0.85em] md:grid-cols-2 xl:grid-cols-3">
              <FiltroLabel icon={faSearch} texto="Buscar">
                <div className="flex h-[2.75em] items-center gap-[0.6em] rounded-[0.6em] border border-cuarto/10 bg-primero-claro/60 px-[0.85em] transition focus-within:border-segundo/60 focus-within:ring-1 focus-within:ring-segundo/40">
                  <FontAwesomeIcon icon={faSearch} className="text-[0.8em] text-segundo/70 flex-shrink-0" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Nombre, correo o documento"
                    className="min-w-0 flex-1 bg-transparent text-[0.9em] font-roboto text-cuarto placeholder:text-cuarto/30 outline-none"
                  />
                  {busqueda && (
                    <button type="button" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda" className="text-cuarto/40 hover:text-cuarto transition-colors flex-shrink-0">
                      <FontAwesomeIcon icon={faXmark} className="text-[0.85em]" />
                    </button>
                  )}
                </div>
              </FiltroLabel>

              <FiltroLabel icon={faUserShield} texto="Rol">
                <Select
                  value={filtroRol}
                  onChange={setFiltroRol}
                  options={[{ value: TODOS, label: 'Todos los roles' }, ...Object.entries(ROL_LABEL).map(([value, label]) => ({ value, label }))]}
                />
              </FiltroLabel>

              <FiltroLabel icon={faFilter} texto="Estado">
                <Select
                  value={filtroEstado}
                  onChange={setFiltroEstado}
                  options={[{ value: TODOS, label: 'Todos' }, { value: 'activo', label: 'Activos' }, { value: 'inactivo', label: 'Inactivos' }]}
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
          <SkeletonTarjetas />
        ) : (
          <>
            <div className="flex justify-end">
              <span className="text-[0.8em] text-cuarto/40 font-roboto">
                {visibles.length === usuarios.length
                  ? `${usuarios.length} usuario${usuarios.length === 1 ? '' : 's'}`
                  : `${visibles.length} de ${usuarios.length} usuarios`}
              </span>
            </div>

            {visibles.length === 0 ? (
              <EmptyState
                icon={faUsers}
                titulo={hayFiltros ? 'Sin resultados' : 'Aún no hay usuarios'}
                descripcion={hayFiltros ? 'Ningún usuario coincide con esos filtros.' : 'Crea el primer usuario para tu equipo.'}
              />
            ) : (
              <div className="grid grid-cols-1 gap-[1em] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibles.map((u) => (
                  <TarjetaUsuario
                    key={u.id}
                    usuario={u}
                    esYo={u.id === usuarioActual?.id}
                    onEdit={() => setEditingUsuario(u)}
                    onRemove={() => requestRemove(u.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nuevo usuario" size="xl">
        <UsuarioForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
      </Modal>

      <Modal isOpen={Boolean(editingUsuario)} onClose={() => setEditingUsuario(null)} title="Editar usuario" size="xl">
        {editingUsuario && (
          <UsuarioForm initialValues={editingUsuario} onSubmit={handleUpdate} onCancel={() => setEditingUsuario(null)} />
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        confirming={deleting}
        label={`el usuario "${usuarios.find((u) => u.id === deletingId)?.nombre ?? ''}"`}
        onCancel={cancelRemove}
        onConfirm={confirmRemove}
      />
    </div>
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

// Fila de contacto dentro de la tarjeta: ícono tenue + valor truncado.
function Dato({ icon, children }) {
  return (
    <div className="flex items-center gap-[0.6em] min-w-0">
      <FontAwesomeIcon icon={icon} className="w-[0.9em] text-[0.75em] text-cuarto/25 flex-shrink-0" />
      <span className="truncate text-[0.8em] text-cuarto/60 font-roboto">{children}</span>
    </div>
  );
}

function TarjetaUsuario({ usuario, esYo, onEdit, onRemove }) {
  const inactivo = usuario.activo === false;

  return (
    <div className="group flex flex-col gap-[1em] rounded-[1em] border border-cuarto/10 border-l-[3px] border-l-segundo/50 bg-primero-claro p-[1.1em] transition-all duration-150 hover:border-cuarto/20 hover:border-l-segundo hover:shadow-lg hover:shadow-primero-oscuro/30">
      {/* Identidad */}
      <div className="flex items-start gap-[0.85em]">
        <div className={`w-[3em] h-[3em] rounded-full flex items-center justify-center flex-shrink-0 border ${inactivo ? 'bg-cuarto/5 border-cuarto/10 opacity-60' : 'bg-segundo/15 border-segundo/40'}`}>
          <span className={`text-[1em] font-bold font-poppins ${inactivo ? 'text-cuarto/40' : 'text-segundo'}`}>
            {usuario.nombre?.[0]?.toUpperCase() ?? '?'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[0.95em] font-bold font-poppins text-cuarto leading-tight">
            {usuario.nombre}
            {esYo && <span className="text-cuarto/40 font-normal"> (tú)</span>}
          </h3>
          <div className="mt-[0.4em] flex flex-wrap items-center gap-[0.4em]">
            <span className="rounded-full bg-segundo/15 border border-segundo/20 px-[0.6em] py-[0.1em] text-[0.7em] font-semibold font-poppins text-segundo">
              {ROL_LABEL[usuario.rol] ?? usuario.rol}
            </span>
            {inactivo && (
              <span className="rounded-full bg-quinto/20 border border-quinto/30 px-[0.6em] py-[0.1em] text-[0.7em] font-semibold font-poppins text-quinto-claro">
                Inactivo
              </span>
            )}
          </div>
        </div>
        {/* Acciones: visibles en touch, aparecen al hover en escritorio */}
        <div className="flex items-center gap-[0.1em] flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
          <button onClick={onEdit} aria-label="Editar usuario" className="w-[1.9em] h-[1.9em] flex items-center justify-center rounded-[0.4em] text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50">
            <FontAwesomeIcon icon={faPen} className="text-[0.75em]" />
          </button>
          {!esYo && (
            <button onClick={onRemove} aria-label="Eliminar usuario" className="w-[1.9em] h-[1.9em] flex items-center justify-center rounded-[0.4em] text-quinto/40 hover:text-quinto-claro hover:bg-quinto/10 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-quinto/50">
              <FontAwesomeIcon icon={faTrash} className="text-[0.75em]" />
            </button>
          )}
        </div>
      </div>

      {/* Cargo destacado */}
      <div className="flex items-center gap-[0.6em] rounded-[0.6em] border border-cuarto/5 bg-primero/40 px-[0.75em] py-[0.55em]">
        <FontAwesomeIcon icon={faBriefcase} className={`text-[0.75em] flex-shrink-0 ${usuario.cargo ? 'text-segundo/70' : 'text-cuarto/20'}`} />
        <span className={`truncate text-[0.8em] font-semibold font-roboto ${usuario.cargo ? 'text-cuarto/80' : 'text-cuarto/35'}`}>
          {usuario.cargo || 'Sin cargo asignado'}
        </span>
      </div>

      {/* Contacto */}
      <div className="flex flex-col gap-[0.4em]">
        <Dato icon={faEnvelope}>{usuario.email || '—'}</Dato>
        <Dato icon={faPhone}>{usuario.telefono || '—'}</Dato>
        <Dato icon={faLocationDot}>{usuario.ubicacion || '—'}</Dato>
        <Dato icon={faIdCard}>{usuario.documento || '—'}</Dato>
      </div>
    </div>
  );
}

// Grid de tarjetas fantasma con el barrido de luz, mientras carga la lista.
function SkeletonTarjetas() {
  return (
    <Esqueleto etiqueta="Cargando los usuarios" className="grid grid-cols-1 gap-[1em] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-[1em] border border-cuarto/10 border-l-[3px] border-l-cuarto/10 bg-primero-claro p-[1.1em] flex flex-col gap-[1em]">
          <div className="flex items-center gap-[0.85em]">
            <span className="tq-shimmer block w-[3em] h-[3em] rounded-full flex-shrink-0" />
            <div className="flex flex-col gap-[0.4em] flex-1">
              <span className="tq-shimmer block w-[60%] h-[0.9em] rounded-[0.4em]" />
              <span className="tq-shimmer block w-[40%] h-[0.9em] rounded-full" />
            </div>
          </div>
          <span className="tq-shimmer block w-full h-[2.1em] rounded-[0.6em]" />
          <div className="flex flex-col gap-[0.45em]">
            <span className="tq-shimmer block w-[85%] h-[0.75em] rounded-[0.4em]" />
            <span className="tq-shimmer block w-[55%] h-[0.75em] rounded-[0.4em]" />
            <span className="tq-shimmer block w-[65%] h-[0.75em] rounded-[0.4em]" />
          </div>
        </div>
      ))}
    </Esqueleto>
  );
}

export default GestionUsuarios;
