import { Bloque, Esqueleto } from '../../../components/Skeleton';

// Esqueletos de las pantallas del tablero. Cada uno imita la geometría real de
// lo que va a sustituir —misma tarjeta, mismo grid, mismos anchos aproximados—
// para que al llegar los datos no haya salto. El rótulo lo pone el contenedor
// (Esqueleto) una sola vez; las piezas anidadas van sin rótulo.

// Réplica del cuerpo de una CategoryCard/ModuleCard: barra lateral de acento,
// header con pastilla, título, filas de info y footer separado.
function TarjetaSkeleton() {
  return (
    <div className="relative flex h-full overflow-hidden rounded-[0.85em] bg-primero-claro border border-cuarto/10">
      <div className="w-[0.25em] flex-shrink-0 tq-shimmer" />
      <div className="flex-1 flex flex-col px-[1em] sm:px-[1.25em] py-[1em] sm:py-[1.25em] min-w-0 gap-[0.75em]">
        <div className="flex items-center gap-[0.4em]">
          <Bloque w="4.5em" h="1.4em" r="0.4em" />
          <Bloque w="3em" h="1.4em" r="0.4em" />
        </div>
        <Bloque w="70%" h="1.4em" />
        <div className="flex flex-col gap-[0.45em] mt-[0.25em]">
          <Bloque w="90%" />
          <Bloque w="55%" />
          <Bloque w="65%" />
        </div>
        <div className="mt-auto pt-[0.75em] border-t border-cuarto/10 flex items-center justify-between">
          <Bloque w="40%" />
          <Bloque w="2em" h="1em" />
        </div>
      </div>
    </div>
  );
}

// Grid de tarjetas de categoría/módulo — el estado de carga de Tablero y
// ModulosCategoria. Seis tarjetas llenan el primer viewport sin pasarse.
export function TableroSkeleton({ etiqueta = 'Cargando el tablero' }) {
  return (
    <Esqueleto etiqueta={etiqueta} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[0.85em] sm:gap-[1em]">
      {Array.from({ length: 8 }).map((_, i) => (
        <TarjetaSkeleton key={i} />
      ))}
    </Esqueleto>
  );
}

// Tarjeta de un tablero de equipo en la galería /equipos: barra lateral de
// acento, avatar circular + nombre, dos filas de conteo y footer separado.
function TarjetaEquipoSkeleton() {
  return (
    <div className="flex h-full overflow-hidden rounded-[0.85em] bg-primero-claro border border-cuarto/10">
      <div className="w-[0.25em] flex-shrink-0 tq-shimmer" />
      <div className="flex-1 flex flex-col px-[1em] sm:px-[1.25em] py-[1em] sm:py-[1.25em] min-w-0 gap-[0.85em]">
        <div className="flex items-center gap-[0.6em]">
          <span className="tq-shimmer block w-[2.5em] h-[2.5em] rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-[0.4em] flex-1 min-w-0">
            <Bloque w="70%" h="1.1em" />
            <Bloque w="45%" />
          </div>
        </div>
        <div className="flex flex-col gap-[0.45em]">
          <Bloque w="55%" />
          <Bloque w="60%" />
        </div>
        <div className="mt-auto pt-[0.75em] border-t border-cuarto/10">
          <Bloque w="45%" />
        </div>
      </div>
    </div>
  );
}

// Esqueleto de PANTALLA COMPLETA: barra superior (imita el AppHeader) + grid de
// tarjetas. Se usa mientras AmbitoScope prepara el tablero, antes de que la
// página real —con su propio header— llegue a montarse. Sin esto, cambiar de
// tablero mostraba un spinner suelto en negro y el salto se notaba.
export function TableroPantallaSkeleton() {
  return (
    <div className="min-h-dvh bg-primero">
      <div className="h-[3.5em] sm:h-[4em] px-[1em] sm:px-[1.5em] flex items-center gap-[0.75em] border-b border-cuarto/10 bg-primero-fuerte">
        <span className="tq-shimmer block w-[2em] h-[2em] rounded-[0.5em] flex-shrink-0" />
        <span className="tq-shimmer block w-[2em] h-[2em] rounded-[0.5em] flex-shrink-0" />
        <div className="flex-1" />
        <span className="tq-shimmer block w-[2.25em] h-[2.25em] rounded-full flex-shrink-0" />
        <span className="tq-shimmer block w-[2.25em] h-[2.25em] rounded-full flex-shrink-0" />
      </div>
      <div className="px-[1em] sm:px-[1.5em] xl:px-[2em] py-[1em] sm:py-[1.5em]">
        <TableroSkeleton etiqueta="Abriendo el tablero" />
      </div>
    </div>
  );
}

// Fila de un requerimiento en el panel izquierdo del detalle.
function ReqFilaSkeleton() {
  return (
    <div className="rounded-[0.6em] border border-cuarto/10 bg-primero/40 px-[0.85em] py-[0.7em] flex flex-col gap-[0.5em]">
      <Bloque w="85%" />
      <div className="flex items-center gap-[0.4em]">
        <Bloque w="3em" h="1.2em" r="0.35em" />
        <Bloque w="3.5em" h="1.2em" r="0.35em" />
        <Bloque w="3em" h="1.2em" r="0.35em" />
      </div>
    </div>
  );
}

// Esqueleto de PANTALLA COMPLETA del detalle de módulo: header + barra de módulo
// + los dos paneles (requerimientos / detalle). Reemplaza el spinner suelto que
// además ocultaba el header hasta terminar de cargar.
export function DetalleModuloSkeleton() {
  return (
    <div className="min-h-dvh bg-primero">
      <div className="h-[3.5em] sm:h-[4em] px-[1em] sm:px-[1.5em] flex items-center gap-[0.75em] border-b border-cuarto/10 bg-primero-fuerte">
        <span className="tq-shimmer block w-[2em] h-[2em] rounded-[0.5em] flex-shrink-0" />
        <span className="tq-shimmer block w-[2em] h-[2em] rounded-[0.5em] flex-shrink-0" />
        <div className="flex flex-col gap-[0.35em] flex-1 min-w-0">
          <Bloque w="8em" h="0.7em" />
          <Bloque w="6em" h="0.8em" />
        </div>
        <span className="tq-shimmer block w-[2.25em] h-[2.25em] rounded-full flex-shrink-0" />
      </div>

      <Esqueleto
        etiqueta="Cargando el módulo"
        className="px-[1em] sm:px-[1.5em] py-[1.25em] sm:py-[1.75em] max-w-[90em] mx-auto flex flex-col gap-[1.5em]"
      >
        <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] px-[1em] py-[0.85em] flex items-center gap-[0.6em]">
          <Bloque w="10em" h="1.1em" />
          <Bloque w="3em" h="1.2em" r="0.35em" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.5em]">
          <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] overflow-hidden">
            <div className="px-[1.25em] sm:px-[1.5em] py-[1em] border-b border-cuarto/10">
              <Bloque w="12em" h="1em" />
            </div>
            <div className="px-[1.25em] sm:px-[1.5em] py-[1.25em] flex flex-col gap-[0.6em]">
              {Array.from({ length: 4 }).map((_, i) => <ReqFilaSkeleton key={i} />)}
            </div>
          </div>
          <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] overflow-hidden">
            <div className="px-[1.25em] sm:px-[1.5em] py-[0.85em] border-b border-cuarto/10 flex gap-[0.5em]">
              <Bloque w="50%" h="2.25em" r="0.5em" />
              <Bloque w="50%" h="2.25em" r="0.5em" />
            </div>
            <div className="px-[1.25em] sm:px-[1.5em] py-[1.25em] flex flex-col gap-[0.75em]">
              <Bloque w="70%" />
              <Bloque w="90%" />
              <Bloque w="55%" />
            </div>
          </div>
        </div>
      </Esqueleto>
    </div>
  );
}

export function EquiposSkeleton() {
  return (
    <Esqueleto etiqueta="Cargando tus tableros de equipo" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[0.85em] sm:gap-[1em]">
      {Array.from({ length: 4 }).map((_, i) => (
        <TarjetaEquipoSkeleton key={i} />
      ))}
    </Esqueleto>
  );
}
