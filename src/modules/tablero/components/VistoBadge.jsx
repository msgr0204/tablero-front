import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../../components/Modal';
import { formatearFechaHora } from '../../../lib/formatFecha';
import vistoService from '../services/vistoService';

// Acuse de recibo de una categoría/módulo del tablero de empresa. Muestra:
//  - Si YO aún no lo vi (y no soy el creador): botón "Marcar como visto".
//  - Si ya lo vi o soy creador: chip "Visto X/Y" clickeable que abre la
//    trazabilidad (quiénes vieron, quiénes faltan).
// `visto` = { vistos, total, loVi, esCreador } que adjunta el backend; null en
// ámbito personal (ahí no se renderiza nada).
function VistoBadge({ entidad, entidadId, visto, onMarcado }) {
  const [marcando, setMarcando] = useState(false);
  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  if (!visto) return null;

  const { vistos, total, loVi, esCreador } = visto;

  const handleMarcar = async (e) => {
    e.stopPropagation();
    setMarcando(true);
    try {
      await vistoService.marcar(entidad, entidadId);
      onMarcado?.();
    } finally {
      setMarcando(false);
    }
  };

  const abrirDetalle = async (e) => {
    e.stopPropagation();
    setDetalleAbierto(true);
    setCargandoDetalle(true);
    try {
      setDetalle(await vistoService.getDetalle(entidad, entidadId));
    } catch {
      setDetalle([]);
    } finally {
      setCargandoDetalle(false);
    }
  };

  return (
    <>
      {!loVi && !esCreador ? (
        <button
          onClick={handleMarcar}
          disabled={marcando}
          aria-label="Marcar como visto"
          className="inline-flex items-center gap-[0.35em] px-[0.6em] py-[0.15em] rounded-[0.4em] bg-cuarto/10 border border-cuarto/20 text-cuarto/60 text-[0.7em] font-poppins font-medium hover:bg-segundo/15 hover:border-segundo/30 hover:text-segundo transition-all duration-200 focus:outline-none disabled:opacity-50"
        >
          {marcando
            ? <div className="w-[0.7em] h-[0.7em] border border-cuarto/40 border-t-cuarto rounded-full animate-spin" />
            : <FontAwesomeIcon icon={faEyeSlash} className="text-[0.7em]" />}
          Marcar visto
        </button>
      ) : (
        <button
          onClick={abrirDetalle}
          aria-label="Ver quién ha visto"
          className="inline-flex items-center gap-[0.35em] px-[0.6em] py-[0.15em] rounded-[0.4em] bg-segundo/10 border border-segundo/25 text-segundo text-[0.7em] font-poppins font-medium hover:bg-segundo/20 transition-all duration-200 focus:outline-none"
        >
          <FontAwesomeIcon icon={faEye} className="text-[0.7em]" />
          Visto {vistos}/{total}
        </button>
      )}

      <span onClick={(e) => e.stopPropagation()}>
        <Modal isOpen={detalleAbierto} onClose={() => setDetalleAbierto(false)} title="Confirmaciones de visto" size="md">
          {cargandoDetalle ? (
            <div className="flex items-center justify-center py-[2.5em]">
              <div className="w-[1.25em] h-[1.25em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
            </div>
          ) : (
            <ul className="flex flex-col gap-[0.5em]">
              {(detalle ?? []).map((u) => (
                <li key={u.id} className="flex items-center gap-[0.6em] px-[0.75em] py-[0.6em] rounded-[0.6em] border border-cuarto/10">
                  <div className={`w-[1.75em] h-[1.75em] rounded-full flex items-center justify-center flex-shrink-0 ${u.visto ? 'bg-segundo/15 text-segundo' : 'bg-cuarto/10 text-cuarto/40'}`}>
                    <FontAwesomeIcon icon={u.visto ? faCheck : faXmark} className="text-[0.7em]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.85em] text-cuarto/85 font-roboto truncate">{u.nombre}</p>
                    <p className="text-[0.7em] text-cuarto/35 font-roboto">
                      {u.visto ? `Visto el ${formatearFechaHora(u.visto_at)}` : 'Aún no lo ha visto'}
                    </p>
                  </div>
                </li>
              ))}
              {(detalle ?? []).length === 0 && (
                <p className="text-[0.85em] text-cuarto/30 font-roboto italic text-center py-[2em]">Sin usuarios que deban confirmar</p>
              )}
            </ul>
          )}
        </Modal>
      </span>
    </>
  );
}

export default VistoBadge;
