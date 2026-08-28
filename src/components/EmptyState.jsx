import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Estado vacío reutilizable: ícono en pastilla + título + subtexto guía.
// Un "Sin datos" suelto en un cuadro grande se lee como algo roto; esto lo
// convierte en un mensaje que explica por qué está vacío y, opcionalmente,
// ofrece una acción para llenarlo.
//
// altura fija el alto mínimo cuando el vacío ocupa el sitio de un gráfico, para
// que la tarjeta no se colapse; se omite en listados que crecen con su contenido.
function EmptyState({ icon, titulo, descripcion, accion, altura }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center gap-[0.75em] py-[2em]"
      style={altura ? { minHeight: altura } : undefined}
    >
      {icon && (
        <div className="w-[3em] h-[3em] rounded-[0.9em] bg-cuarto/[0.04] border border-cuarto/10 flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-cuarto/25 text-[1.15em]" />
        </div>
      )}
      <div>
        <p className="text-[0.85em] font-medium text-cuarto/60 font-poppins">{titulo}</p>
        {descripcion && (
          <p className="text-[0.75em] text-cuarto/35 font-roboto mt-[0.25em] max-w-[22em]">{descripcion}</p>
        )}
      </div>
      {accion}
    </div>
  );
}

export default EmptyState;
