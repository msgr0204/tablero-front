import { useAuth } from '../../../context/AuthContext';
import { useAmbito } from '../../../context/AmbitoContext';

// Espejo en el front de la matriz de permisos del backend (que es la fuente de
// verdad). Sirve para ocultar/deshabilitar controles que igual serían
// rechazados en el servidor, dando una UX clara en tableros compartidos.
//
// Dos tipos de permiso distintos:
//  1. AUTORÍA de ítems (editar/borrar/agregar-hijos): estricta para TODOS,
//     incluido el dueño del tablero — solo quien creó el ítem lo modifica. Esto
//     evita manipulación de lo ajeno y mantiene la trazabilidad.
//  2. PRIVILEGIOS de dueño (marcar estado final, completar, catálogo, equipo,
//     reordenar): solo el dueño del tablero personal.
// En empresa no hay restricciones (todos con todo, como siempre).
function usePermisosTablero() {
  const { usuario } = useAuth();
  const { esPersonal, esDueno } = useAmbito();

  const puedeModificarItem = (item) => {
    if (!esPersonal) return true;
    // Ítems sin creador (empresa o previos) quedan abiertos, igual que el backend.
    if (!item?.creado_por_id) return true;
    return item.creado_por_id === usuario?.id;
  };

  // Privilegios exclusivos del dueño del tablero (en personal).
  const puedeMarcarFinal = !esPersonal || esDueno;
  const puedeGestionarCatalogo = !esPersonal || esDueno;
  const puedeGestionarEquipo = esPersonal && esDueno;

  return { puedeModificarItem, puedeMarcarFinal, puedeGestionarCatalogo, puedeGestionarEquipo };
}

export default usePermisosTablero;
