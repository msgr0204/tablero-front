import Badge from '../../../../components/Badge';

const ESTADOS = [
  { label: 'Pendiente', color: 'bg-tercero/10 text-tercero border-tercero/20' },
  { label: 'En análisis', color: 'bg-octavo/10 text-octavo border-octavo/20' },
  { label: 'Desarrollo', color: 'bg-sexto/10 text-sexto border-sexto/20' },
  { label: 'Entregado', color: 'bg-septimo/10 text-septimo border-septimo/20' },
];

const PRIORIDADES = [
  { label: 'Mejora', color: 'bg-segundo/10 text-segundo border-segundo/20' },
  { label: 'Urgente', color: 'bg-quinto/10 text-quinto-claro border-quinto/30' },
  { label: 'Error', color: 'bg-quinto/10 text-quinto-claro border-quinto/30' },
  { label: 'Solicitud cliente', color: 'bg-tercero/10 text-tercero border-tercero/20' },
];

/**
 * Vista decorativa de estados/prioridades personalizables, usada
 * únicamente como preview dentro del carrusel de autenticación.
 */
function StatusBadgesPreview() {
  return (
    <div className="flex flex-col gap-[1em] w-full rounded-[0.85em] bg-primero-claro/80 border border-cuarto/10 shadow-xl shadow-primero-oscuro/40 p-[1.1em]">
      <div>
        <p className="text-[0.65em] font-semibold text-cuarto/40 font-poppins uppercase tracking-wider mb-[0.5em]">
          Estados
        </p>
        <div className="flex flex-wrap gap-[0.4em]">
          {ESTADOS.map((e) => <Badge key={e.label} config={e} />)}
        </div>
      </div>
      <div>
        <p className="text-[0.65em] font-semibold text-cuarto/40 font-poppins uppercase tracking-wider mb-[0.5em]">
          Prioridades
        </p>
        <div className="flex flex-wrap gap-[0.4em]">
          {PRIORIDADES.map((p) => <Badge key={p.label} config={p} />)}
        </div>
      </div>
    </div>
  );
}

export default StatusBadgesPreview;
