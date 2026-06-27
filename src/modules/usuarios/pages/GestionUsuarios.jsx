import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPen, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import AppHeader from '../../../components/AppHeader';
import Modal from '../../../components/Modal';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import UsuarioForm from '../components/UsuarioForm';
import useUsuarios from '../hooks/useUsuarios';
import useConfirmDelete from '../../../hooks/useConfirmDelete';
import { useAuth } from '../../../context/AuthContext';
import { useBranding } from '../../../context/BrandingContext';

const ROL_LABEL = { admin: 'Administrador', miembro: 'Miembro' };

function GestionUsuarios() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const { usuario: usuarioActual } = useAuth();
  const { usuarios, loading, fetchUsuarios, createUsuario, updateUsuario, removeUsuario } = useUsuarios();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
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

      <main className="px-[1em] sm:px-[1.5em] py-[1em] sm:py-[1.5em] max-w-[48em] mx-auto flex flex-col gap-[0.75em]">
        {loading ? (
          <div className="flex items-center justify-center py-[6em]">
            <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
          </div>
        ) : (
          <ul className="flex flex-col gap-[0.5em]">
            {usuarios.map((u) => (
              <li
                key={u.id}
                className="flex items-center gap-[0.75em] bg-primero-claro border border-cuarto/10 rounded-[0.6em] px-[0.85em] py-[0.7em]"
              >
                <div className="w-[2em] h-[2em] rounded-full bg-segundo/20 border border-segundo/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-[0.75em] font-bold font-poppins text-segundo">
                    {u.nombre?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.875em] text-cuarto/85 font-roboto truncate">
                    {u.nombre}
                    {u.id === usuarioActual?.id && <span className="text-cuarto/40"> (tú)</span>}
                  </p>
                  <p className="text-[0.75em] text-cuarto/40 font-roboto truncate">{u.email}</p>
                </div>
                <span className="text-[0.7em] font-poppins font-medium text-segundo/80 bg-segundo/10 border border-segundo/20 rounded-[0.4em] px-[0.6em] py-[0.2em] flex-shrink-0">
                  {ROL_LABEL[u.rol] ?? u.rol}
                </span>
                <button
                  onClick={() => setEditingUsuario(u)}
                  aria-label="Editar usuario"
                  className="w-[2em] h-[2em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faPen} className="text-[0.8em]" />
                </button>
                {u.id !== usuarioActual?.id && (
                  <button
                    onClick={() => requestRemove(u.id)}
                    aria-label="Eliminar usuario"
                    className="w-[2em] h-[2em] flex items-center justify-center rounded-[0.5em] text-quinto/40 hover:text-quinto-claro hover:bg-quinto/10 transition-all duration-200 focus:outline-none flex-shrink-0"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-[0.8em]" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nuevo usuario">
        <UsuarioForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
      </Modal>

      <Modal isOpen={Boolean(editingUsuario)} onClose={() => setEditingUsuario(null)} title="Editar usuario">
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

export default GestionUsuarios;
