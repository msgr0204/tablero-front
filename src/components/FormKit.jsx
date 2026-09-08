import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Lenguaje común de los formularios de la app. Vive aquí —y no repetido en cada
// formulario— porque el problema anterior era justo ese: cada modal se escribió
// en su época con su propio alto de input y su propio redondeo, y juntos se leían
// como piezas de aplicaciones distintas.

// El error solo cambia el borde: si además moviera el alto o el padding, el campo
// daría un salto al aparecer el mensaje debajo.
export const inputClass = (hasError) => [
  'w-full h-[2.75em] px-[0.85em] rounded-[0.6em] text-[0.9em] font-roboto outline-none transition-all duration-150',
  'bg-primero-claro/60 text-cuarto placeholder:text-cuarto/30 border',
  hasError
    ? 'border-quinto/60 focus:border-quinto focus:ring-1 focus:ring-quinto/30'
    : 'border-cuarto/10 hover:border-cuarto/20 focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40',
].join(' ');

// Mismo trazo que inputClass pero sin alto fijo, para textarea y campos que crecen.
export const areaClass = (hasError) => [
  'w-full px-[0.85em] py-[0.6em] rounded-[0.6em] text-[0.9em] font-roboto outline-none transition-all duration-150 resize-none',
  'bg-primero-claro/60 text-cuarto placeholder:text-cuarto/30 border',
  hasError
    ? 'border-quinto/60 focus:border-quinto focus:ring-1 focus:ring-quinto/30'
    : 'border-cuarto/10 hover:border-cuarto/20 focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40',
].join(' ');

// Campo con etiqueta arriba. La etiqueta va fuera del input y no como placeholder
// porque el placeholder desaparece al escribir: en un formulario de ocho campos,
// revisar lo que se escribió obliga a recordar qué pedía cada casilla.
export function Campo({ label, required, hint, error, className = '', children }) {
  return (
    <div className={`flex flex-col gap-[0.35em] min-w-0 ${className}`}>
      {label && (
        <label className="text-[0.7em] font-semibold text-cuarto/50 font-poppins uppercase tracking-wider">
          {label}
          {required && <span className="text-quinto ml-[0.25em]">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[0.7em] text-cuarto/35 font-roboto">{hint}</p>}
      {error && <p className="text-[0.7em] text-quinto-claro font-roboto">{error}</p>}
    </div>
  );
}

// Encabezado de grupo con filete degradado. Separa bloques sin meter una línea
// dura entre cada uno, que trocearía el formulario en cajas sueltas.
export function Seccion({ icon, titulo, children }) {
  return (
    <div className="flex flex-col gap-[0.85em]">
      <div className="flex items-center gap-[0.6em]">
        {icon && <FontAwesomeIcon icon={icon} className="text-[0.8em] text-segundo/70" />}
        <span className="text-[0.7em] font-bold uppercase tracking-[0.12em] text-cuarto/50 font-poppins">{titulo}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-cuarto/15 to-transparent" />
      </div>
      {children}
    </div>
  );
}

// Rejilla de campos: una columna en móvil, dos desde sm.
export function CamposGrid({ children, className = '' }) {
  return <div className={`grid gap-[0.85em] sm:grid-cols-2 ${className}`}>{children}</div>;
}

// Aviso de error del formulario completo (el que llega del servidor o el de
// "corrige los campos"), en rojo y con ícono.
export function ErrorAviso({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="flex items-start gap-[0.6em] text-[0.8em] text-quinto-claro bg-quinto/10 border border-quinto/20 rounded-[0.6em] py-[0.6em] px-[0.85em]">
      <span className="mt-[0.15em] flex-shrink-0">⚠</span>
      {children}
    </p>
  );
}
