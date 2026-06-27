const ETIQUETAS_ENTIDAD = {
  Categoria: 'Categoría',
  Modulo: 'Módulo',
  Requerimiento: 'Requerimiento',
  ObservacionModulo: 'Observación de módulo',
  ObservacionRequerimiento: 'Observación de requerimiento',
};

/**
 * Construye la ruta del tablero a la que debe navegar el link de una
 * notificación, a partir del `destino` ya resuelto por el backend
 * (categoria_id/modulo_id/requerimiento_id). Devuelve null si la entidad
 * fue eliminada (el backend no pudo resolver destino) o no es navegable.
 */
function resolverRutaNotificacion(notificacion) {
  const { entidad, destino } = notificacion;
  if (!destino) return null;

  if (entidad === 'Categoria' && destino.categoria_id) {
    return `/tablero?editar=${destino.categoria_id}`;
  }

  if ((entidad === 'Modulo' || entidad === 'ObservacionModulo') && destino.categoria_id && destino.modulo_id) {
    return `/tablero/${destino.categoria_id}/modulos/${destino.modulo_id}`;
  }

  if ((entidad === 'Requerimiento' || entidad === 'ObservacionRequerimiento') && destino.categoria_id && destino.modulo_id) {
    return `/tablero/${destino.categoria_id}/modulos/${destino.modulo_id}`;
  }

  return null;
}

function etiquetaEntidad(entidad) {
  return ETIQUETAS_ENTIDAD[entidad] ?? entidad;
}

export { etiquetaEntidad };
export default resolverRutaNotificacion;
