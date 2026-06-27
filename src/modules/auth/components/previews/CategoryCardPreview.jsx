import Badge from '../../../../components/Badge';

const ESTADO = { label: 'Pendiente', color: 'bg-tercero/10 text-tercero border-tercero/20' };
const PRIORIDAD = { label: 'Urgente', color: 'bg-quinto/10 text-quinto-claro border-quinto/30' };

/**
 * Vista decorativa (no interactiva) de una CategoryCard real, usada
 * únicamente como preview dentro del carrusel de autenticación.
 */
function CategoryCardPreview() {
  return (
    <div className="flex w-full overflow-hidden rounded-[0.85em] bg-primero-claro/80 border border-cuarto/10 shadow-xl shadow-primero-oscuro/40">
      <div className="w-[0.25em] flex-shrink-0 bg-segundo" />
      <div className="flex-1 px-[1em] py-[1em] min-w-0">
        <div className="flex items-center gap-[0.4em] flex-wrap mb-[0.5em]">
          <span className="inline-flex items-center px-[0.6em] py-[0.15em] rounded-[0.4em] bg-segundo/10 border border-segundo/20 text-segundo text-[0.7em] font-poppins font-medium">
            Categoría
          </span>
          <Badge config={ESTADO} size="sm" />
          <Badge config={PRIORIDAD} size="sm" />
        </div>
        <h3 className="text-[1.05em] font-bold font-poppins text-cuarto leading-tight mb-[0.6em]">
          Plataforma DA
        </h3>
        <div className="flex flex-col gap-[0.25em] mb-[0.75em]">
          <Row label="Módulos" value="26" />
          <Row label="Creado por" value="quantum_infinity1" />
        </div>
        <div className="pt-[0.6em] border-t border-cuarto/10 flex items-center justify-between">
          <span className="text-[0.65em] text-cuarto/30 font-roboto uppercase tracking-wider">
            Total requerimientos
          </span>
          <span className="text-[0.85em] font-bold font-poppins text-segundo">119</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline gap-[0.5em]">
      <span className="text-[0.7em] text-cuarto/40 font-roboto w-[5em] flex-shrink-0">{label}:</span>
      <span className="text-[0.7em] text-cuarto/70 font-roboto truncate">{value}</span>
    </div>
  );
}

export default CategoryCardPreview;
