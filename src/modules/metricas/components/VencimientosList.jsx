import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faClock } from '@fortawesome/free-solid-svg-icons';

function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function VencimientosList({ items }) {
  const navigate = useNavigate();

  return (
    <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] p-[1.25em] flex flex-col gap-[1em]">
      <h3 className="text-[0.85em] font-semibold text-cuarto font-poppins uppercase tracking-wider">
        Vencen en los próximos 7 días
      </h3>
      {items.length === 0 ? (
        <p className="text-[0.85em] text-cuarto/25 italic font-roboto py-[1em] text-center">Nada por vencer, todo en orden</p>
      ) : (
        <ul className="flex flex-col gap-[0.5em]">
          {items.map((item) => (
            <li
              key={item.requerimientoId}
              onClick={() => item.categoriaId && navigate(`/tablero/${item.categoriaId}/modulos/${item.moduloId}`)}
              className="flex items-center gap-[0.75em] bg-primero/40 border border-cuarto/10 rounded-[0.6em] px-[0.85em] py-[0.7em] cursor-pointer hover:border-segundo/30 transition-colors duration-200"
            >
              <FontAwesomeIcon
                icon={item.vencido ? faTriangleExclamation : faClock}
                className={`text-[0.85em] flex-shrink-0 ${item.vencido ? 'text-quinto-claro' : 'text-segundo/60'}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[0.85em] text-cuarto/80 font-roboto truncate">{item.texto}</p>
                <p className="text-[0.7em] text-cuarto/40 font-roboto truncate">
                  {item.categoriaNombre} / {item.moduloNombre}
                </p>
              </div>
              <span className={`text-[0.75em] font-roboto font-semibold flex-shrink-0 ${item.vencido ? 'text-quinto-claro' : 'text-segundo'}`}>
                {item.vencido ? 'Vencido' : formatFecha(item.fechaEntrega)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VencimientosList;
