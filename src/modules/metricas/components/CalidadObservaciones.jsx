import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentSlash, faCommentDots } from '@fortawesome/free-solid-svg-icons';

function CalidadObservaciones({ datos }) {
  const porcentajeSinObs = datos.totalCompletados > 0
    ? Math.round((datos.completadosSinObservaciones / datos.totalCompletados) * 100)
    : 0;

  return (
    <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] p-[1.25em] flex flex-col gap-[1em]">
      <h3 className="text-[0.85em] font-semibold text-cuarto font-poppins uppercase tracking-wider">Calidad de observaciones</h3>
      <div className="grid grid-cols-2 gap-[0.85em]">
        <div className="flex flex-col gap-[0.4em] bg-primero/40 border border-cuarto/10 rounded-[0.6em] p-[0.85em]">
          <FontAwesomeIcon icon={faCommentSlash} className="text-[0.9em] text-quinto-claro" />
          <span className="text-[1.3em] font-bold font-poppins text-cuarto leading-none">{porcentajeSinObs}%</span>
          <span className="text-[0.75em] text-cuarto/40 font-roboto">
            Completados sin observaciones ({datos.completadosSinObservaciones} de {datos.totalCompletados})
          </span>
        </div>
        <div className="flex flex-col gap-[0.4em] bg-primero/40 border border-cuarto/10 rounded-[0.6em] p-[0.85em]">
          <FontAwesomeIcon icon={faCommentDots} className="text-[0.9em] text-segundo" />
          <span className="text-[1.3em] font-bold font-poppins text-cuarto leading-none">{datos.promedioObservacionesPorRequerimiento}</span>
          <span className="text-[0.75em] text-cuarto/40 font-roboto">Promedio de observaciones por requerimiento</span>
        </div>
      </div>
    </div>
  );
}

export default CalidadObservaciones;
