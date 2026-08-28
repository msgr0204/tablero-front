// Piezas base del esqueleto de carga.
//
// El animate-pulse anterior oscilaba la opacidad de un bloque tenue sobre el
// fondo oscuro: sobre un gris ya al límite de lo perceptible, la animación iba
// de invisible a invisible. Aquí el movimiento es espacial —un barrido de luz
// que cruza la pieza (clase .tq-shimmer en index.css)—, que el ojo detecta sin
// necesidad de subir el contraste, así el esqueleto queda sobrio y no compite
// con el contenido cuando llega.
//
// El barrido va sincronizado: todas las piezas comparten la misma animación CSS
// y por tanto el mismo reloj, y el destello cruza como una sola onda. A cada
// pieza se le da el ancho aproximado de lo que va a sustituir, no uno genérico:
// un esqueleto que no se parece a su contenido produce un salto al resolverse.

// Bloque rectangular con barrido — la pieza mínima (tapa un texto por venir).
export function Bloque({ w = '100%', h = '0.75em', r = '0.4em', className = '', style }) {
  return (
    <span
      className={`tq-shimmer block ${className}`}
      style={{ width: w, height: h, borderRadius: r, ...style }}
      aria-hidden="true"
    />
  );
}

// Círculo con barrido — iconos en pastilla, avatares, anillos.
export function Circulo({ size = '2.5em', className = '', style }) {
  return (
    <span
      className={`tq-shimmer block flex-shrink-0 ${className}`}
      style={{ width: size, height: size, borderRadius: '50%', ...style }}
      aria-hidden="true"
    />
  );
}

// Rótulo de carga visible. Un esqueleto sin palabras se lee como una pantalla a
// medio construir: no dice si algo viene o si se rompió. Va ARRIBA (se lee antes
// de recorrer las formas grises) y alineado a la izquierda. Los tres puntos son
// un elemento aparte con animación propia: en el texto quedarían quietos y un
// "Cargando..." estático junto a un esqueleto que se mueve parece congelado.
function Rotulo({ children }) {
  return (
    <p className="mb-[0.9em] flex items-center gap-[0.5em] text-[0.75em] font-semibold font-poppins text-cuarto/60">
      <span aria-hidden="true" className="tq-shimmer h-[0.4em] w-[0.4em] flex-shrink-0 rounded-full" />
      <span>{children}</span>
      <span className="tq-puntos" aria-hidden="true"><i /><i /><i /></span>
    </p>
  );
}

// Contenedor de un esqueleto: aporta el role="status" (sin esto, quien navega
// sin ver la pantalla no distingue "cargando" de "no tienes nada"), el rótulo
// visible y el fundido de entrada retardado (.tq-esqueleto). conRotulo={false}
// para esqueletos anidados: varios rótulos repiten lo mismo y hacen ruido; manda
// uno, el del bloque principal.
export function Esqueleto({ etiqueta = 'Cargando', conRotulo = true, className = '', children }) {
  return (
    <div className="tq-esqueleto" role="status" aria-live="polite" aria-busy="true">
      {conRotulo ? <Rotulo>{etiqueta}</Rotulo> : <span className="sr-only">{etiqueta}</span>}
      <div className={className}>{children}</div>
    </div>
  );
}

// Lista de filas apiladas — el estado de carga de pantallas tipo listado
// (usuarios, catálogo de estados/prioridades).
export function ListaSkeleton({ etiqueta = 'Cargando', filas = 5 }) {
  return (
    <Esqueleto etiqueta={etiqueta} className="flex flex-col gap-[0.5em]">
      {Array.from({ length: filas }).map((_, i) => (
        <div key={i} className="flex items-center gap-[0.75em] rounded-[0.6em] bg-primero-claro border border-cuarto/10 px-[1em] py-[0.85em]">
          <Circulo size="2em" />
          <div className="flex flex-col gap-[0.4em] flex-1 min-w-0">
            <Bloque w="40%" h="0.9em" />
            <Bloque w="60%" />
          </div>
          <Bloque w="4em" h="1.5em" r="0.4em" />
        </div>
      ))}
    </Esqueleto>
  );
}

// Rejilla de tarjetas — el estado de carga de pantallas tipo panel (dashboard,
// métricas): unas tarjetas de resumen arriba y dos bloques anchos debajo.
export function PanelesSkeleton({ etiqueta = 'Cargando' }) {
  return (
    <Esqueleto etiqueta={etiqueta} className="flex flex-col gap-[1.25em]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1em]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[0.85em] bg-primero-claro border border-cuarto/10 p-[1.1em] flex flex-col gap-[0.6em]">
            <Bloque w="55%" />
            <Bloque w="35%" h="1.4em" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.25em]">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-[0.85em] bg-primero-claro border border-cuarto/10 p-[1.25em] flex flex-col gap-[0.75em]">
            <Bloque w="45%" h="1em" />
            <Bloque w="90%" />
            <Bloque w="75%" />
            <Bloque w="80%" />
          </div>
        ))}
      </div>
    </Esqueleto>
  );
}
