import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { describirAccion, describirEntidad, TONOS } from '../lib/descripcion';
import { formatearFechaHora } from '../../../lib/formatFecha';

// Una línea del feed. Se lee como una frase: quién, qué hizo, sobre qué y cuándo.
function EntradaAuditoria({ entrada }) {
  const { texto, icon, tono } = describirAccion(entrada.accion);
  const esReapertura = entrada.accion === 'reabrir';

  return (
    <li
      className={[
        'flex gap-[0.85em] rounded-[0.75em] border p-[0.85em] transition-colors duration-150',
        // Reabrir algo entregado se destaca: es la acción que suele necesitar
        // explicación, y perderla entre el resto del feed anula su utilidad.
        esReapertura ? 'border-tercero/30 bg-tercero/[0.06]' : 'border-cuarto/10 bg-primero-claro/40',
      ].join(' ')}
    >
      <span className={`w-[2.25em] h-[2.25em] rounded-[0.6em] border flex items-center justify-center flex-shrink-0 ${TONOS[tono]}`}>
        <FontAwesomeIcon icon={icon} className="text-[0.8em]" />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[0.85em] text-cuarto/85 font-roboto leading-snug">
          <span className="font-semibold text-cuarto">{entrada.actor_nombre ?? 'Alguien'}</span>
          {' '}{texto}{' '}
          <span className="text-cuarto/60">{describirEntidad(entrada.entidad)}</span>
          {entrada.entidad_nombre && (
            <> <span className="font-medium text-segundo/80">«{entrada.entidad_nombre}»</span></>
          )}
        </p>

        {entrada.cambios?.length > 0 && (
          <ul className="mt-[0.4em] flex flex-col gap-[0.15em]">
            {entrada.cambios.map((c, i) => (
              <li key={i} className="text-[0.75em] text-cuarto/45 font-roboto flex items-center gap-[0.4em] flex-wrap">
                <span className="text-cuarto/35">{c.campo}:</span>
                <span className="line-through text-cuarto/30">{c.antes ?? '—'}</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[0.7em] text-cuarto/25" />
                <span className="text-cuarto/70">{c.despues ?? '—'}</span>
              </li>
            ))}
          </ul>
        )}

        {esReapertura && entrada.snapshot?.cerrado_por && (
          <p className="mt-[0.4em] text-[0.75em] text-tercero/80 font-roboto">
            Estaba entregado por {entrada.snapshot.cerrado_por}
            {entrada.snapshot.cerrado_at && ` el ${formatearFechaHora(entrada.snapshot.cerrado_at)}`}
            {entrada.snapshot.veces_reabierto > 1 && ` · reabierto ${entrada.snapshot.veces_reabierto} veces`}
          </p>
        )}

        {entrada.snapshot?.arrastro && (
          <p className="mt-[0.4em] text-[0.75em] text-quinto-claro/70 font-roboto">
            Se eliminaron también {entrada.snapshot.arrastro.modulos != null && `${entrada.snapshot.arrastro.modulos} módulo(s) y `}
            {entrada.snapshot.arrastro.requerimientos} requerimiento(s)
          </p>
        )}

        <p className="mt-[0.35em] text-[0.7em] text-cuarto/30 font-roboto">
          {formatearFechaHora(entrada.created_at)}
          {entrada.ambito === 'personal' && ' · tablero personal'}
        </p>
      </div>
    </li>
  );
}

export default EntradaAuditoria;
