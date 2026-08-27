import { useAuth } from '../../../context/AuthContext';
import { useAmbito } from '../../../context/AmbitoContext';

// Espejo en el front de la matriz de permisos del backend (que es la fuente de
// verdad). Sirve para ocultar/deshabilitar controles que igual serían
// rechazados en el servidor, dando una UX clara en tableros compartidos.
//
// - En empresa: sin restricciones (todos pueden con todo, como siempre).
// - En personal propio (soy dueño): puedo todo.
// - En personal de otro (colaborador): solo edito/borro lo que YO creé; no
//   marco estados finales ni completo; no toco el catálogo ni el equipo.
function usePermisosTablero() {
  const { usuario } = useAuth();
  const { esPersonal, esDueno } = useAmbito();

  const puedeModificarItem = (item) => {
    if (!esPersonal) return true;
    if (esDueno) return true;
    // Colaborador: solo lo suyo. Ítems sin creador (viejos) quedan abiertos,
    // igual que en el backend.
    if (!item?.creado_por_id) return true;
    return item.creado_por_id === usuario?.id;
  };

  // Marcar estado final / completar-reabrir: solo el dueño (en personal).
  const puedeMarcarFinal = !esPersonal || esDueno;
  // Gestionar catálogo (estados/prioridades/tipos) y equipo: solo el dueño.
  const puedeGestionarCatalogo = !esPersonal || esDueno;
  const puedeGestionarEquipo = esPersonal && esDueno;

  return { puedeModificarItem, puedeMarcarFinal, puedeGestionarCatalogo, puedeGestionarEquipo };
}

export default usePermisosTablero;
