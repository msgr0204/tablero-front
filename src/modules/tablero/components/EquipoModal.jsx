import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faUsers } from '@fortawesome/free-solid-svg-icons';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import Modal from '../../../components/Modal';
import useEquipo from '../hooks/useEquipo';

function EquipoModal({ isOpen, onClose }) {
  const { equipo, loading, mutandoId, error, fetchEquipo, toggleAcceso } = useEquipo();

  useEffect(() => {
    if (isOpen) fetchEquipo();
  }, [isOpen, fetchEquipo]);

  // Quitar el acceso saca a la persona del tablero y le oculta lo que estaba
  // viendo, así que se confirma. Concederlo no destruye nada: va directo.
  const [porRevocar, setPorRevocar] = useState(null);
  const [revocando, setRevocando] = useState(false);

  const handleToggle = async (colaborador) => {
    if (colaborador.tieneAcceso) {
      setPorRevocar(colaborador);
      return;
    }
    try {
      await toggleAcceso(colaborador);
    } catch { /* el error ya queda en el hook */ }
  };

  const confirmarRevocar = async () => {
    setRevocando(true);
    try {
      await toggleAcceso(porRevocar);
      setPorRevocar(null);
    } catch {
      setPorRevocar(null);
    } finally {
      setRevocando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} eyebrow="Tablero personal" title="Mi equipo" icon={faUsers} size="md">
      <div className="flex flex-col gap-[1em]">
        <p className="text-[0.8em] text-cuarto/60 font-roboto leading-relaxed">
          Elige quién puede ver y colaborar en tu tablero personal
        </p>

        {error && (
          <p className="text-[0.8em] text-quinto-claro font-roboto">{error}</p>
        )}

        {loading ? (
          <div className="flex justify-center py-[2em]">
            <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
          </div>
        ) : equipo.length === 0 ? (
          <p className="text-[0.85em] text-cuarto/40 font-roboto italic text-center py-[2em]">
            No hay otros usuarios en tu empresa aún
          </p>
        ) : (
          <ul className="flex flex-col gap-[0.5em]">
            {equipo.map((usuario) => {
              const mutando = mutandoId === usuario.id;
              return (
                <li
                  key={usuario.id}
                  className="flex items-center gap-[0.75em] p-[0.75em] rounded-[0.75em] border border-cuarto/10"
                >
                  <div className="w-[2.25em] h-[2.25em] flex-shrink-0 flex items-center justify-center rounded-full bg-segundo/10 text-segundo font-poppins font-semibold text-[0.9em]">
                    {(usuario.nombre?.charAt(0) ?? '?').toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[0.85em] text-cuarto font-roboto truncate">{usuario.nombre}</p>
                    <p className="text-[0.75em] text-cuarto/40 font-roboto truncate">{usuario.email}</p>
                  </div>

                  <button
                    onClick={() => handleToggle(usuario)}
                    disabled={mutando}
                    className={[
                      'flex items-center justify-center gap-[0.4em] min-w-[6.5em] h-[2.25em] px-[0.85em] rounded-[0.5em]',
                      'text-[0.75em] font-roboto font-medium transition-all duration-200 flex-shrink-0',
                      'disabled:opacity-60 disabled:cursor-not-allowed outline-none',
                      'focus-visible:ring-2 focus-visible:ring-segundo/50',
                      usuario.tieneAcceso
                        ? 'bg-segundo/15 text-segundo border border-segundo/30 hover:bg-segundo/25'
                        : 'bg-cuarto/5 text-cuarto/60 border border-cuarto/10 hover:bg-cuarto/10 hover:text-cuarto',
                    ].join(' ')}
                  >
                    {mutando ? (
                      <span className="w-[1em] h-[1em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
                    ) : usuario.tieneAcceso ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="text-[0.85em]" />
                        Con acceso
                      </>
                    ) : (
                      'Dar acceso'
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={Boolean(porRevocar)}
        confirming={revocando}
        label={`el acceso de "${porRevocar?.nombre ?? ''}" a tu tablero`}
        onCancel={() => setPorRevocar(null)}
        onConfirm={confirmarRevocar}
      />
    </Modal>
  );
}

export default EquipoModal;
