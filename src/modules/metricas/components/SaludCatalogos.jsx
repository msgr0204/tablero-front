import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function Bloque({ titulo, items, renderLabel }) {
  return (
    <div className="flex flex-col gap-[0.5em]">
      <p className="text-[0.75em] font-semibold text-cuarto/50 font-poppins uppercase tracking-wider">{titulo}</p>
      {items.length === 0 ? (
        <p className="text-[0.8em] text-cuarto/25 italic font-roboto">Sin hallazgos</p>
      ) : (
        <ul className="flex flex-wrap gap-[0.4em]">
          {items.map((item) => (
            <li key={item.id} className="text-[0.75em] text-cuarto/70 font-roboto bg-primero/40 border border-cuarto/10 rounded-[0.4em] px-[0.6em] py-[0.25em]">
              {renderLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SaludCatalogos({ datos }) {
  return (
    <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] p-[1.25em] flex flex-col gap-[1.25em]">
      <div className="flex items-center gap-[0.5em]">
        <FontAwesomeIcon icon={faCircleInfo} className="text-segundo/60 text-[0.9em]" />
        <h3 className="text-[0.85em] font-semibold text-cuarto font-poppins uppercase tracking-wider">Salud de catálogos</h3>
      </div>
      <Bloque titulo="Estados sin uso" items={datos.estadosSinUso} renderLabel={(e) => e.label} />
      <Bloque titulo="Prioridades sin uso" items={datos.prioridadesSinUso} renderLabel={(p) => p.label} />
      <Bloque titulo="Categorías sin módulos" items={datos.categoriasSinModulos} renderLabel={(c) => c.nombre} />
      <Bloque titulo="Módulos sin requerimientos" items={datos.modulosSinRequerimientos} renderLabel={(m) => m.nombre} />
    </div>
  );
}

export default SaludCatalogos;
