import { useAuth } from '../../../context/AuthContext';
import { useAmbito } from '../../../context/AmbitoContext';

// Espejo en el front de la matriz de permisos del backend, que es la fuente de
// verdad. Aquí solo sirve para no ofrecer botones que el servidor va a rechazar:
// ocultar un control es cortesía, no seguridad.
//
// Tres ejes de permiso, deliberadamente separados (colgarlos de un mismo
// predicado hacía que restringir uno cambiara otros sin querer):
//
//  1. AUTORÍA — editar/eliminar un ítem: quien lo creó. En el tablero de empresa
//     un administrador también puede intervenir (alguien deja la empresa, hay un
//     error que corregir), y su intervención queda auditada.
//  2. CICLO DE CIERRE — completar lo puede hacer cualquiera porque avanza el
//     trabajo; REABRIR deshace el cierre de otra persona y en empresa se reserva
//     a administradores.
//  3. CONFIGURACIÓN COMPARTIDA — el catálogo define el vocabulario de todo el
//     tablero: en empresa lo gestiona un administrador; en un tablero personal,
//     su dueño.
//
// Colaborar NO es modificar: aportar un módulo a la categoría de otro está
// permitido. Exigir autoría del padre paralizaría al equipo.
function usePermisosTablero() {
  const { usuario } = useAuth();
  const { esPersonal, esDueno } = useAmbito();

  const esAdmin = usuario?.rol === 'admin';
  const esEmpresa = !esPersonal;

  const esMio = (item) => Boolean(item?.creado_por_id) && item.creado_por_id === usuario?.id;

  // Un ítem sin autor solo lo toca un administrador; tras la migración de
  // autoría no debería quedar ninguno.
  const puedeModificarItem = (item) => esMio(item) || (esEmpresa ? esAdmin : false);
  const puedeEliminarItem = (item) => esMio(item) || (esEmpresa ? esAdmin : false);

  // Aportar contenido dentro de algo ajeno.
  const puedeCrearHijo = true;

  const puedeCerrar = esEmpresa ? true : esDueno;
  const puedeReabrir = esEmpresa ? esAdmin : esDueno;

  const puedeGestionarCatalogo = esEmpresa ? esAdmin : esDueno;
  const puedeReordenar = esEmpresa ? true : esDueno;

  // Equipo y visibilidad siguen siendo cosa del dueño de un tablero personal.
  const puedeGestionarEquipo = esPersonal && esDueno;
  const puedeMarcarVisibilidad = esPersonal && esDueno;

  // Editar una observación ajena no lo puede hacer nadie, ni un administrador:
  // reescribir lo que otro dijo es falsear el registro.
  const puedeEditarObservacion = (obs) => esMio(obs);
  const puedeEliminarObservacion = (obs) => esMio(obs) || (esEmpresa ? esAdmin : false);

  return {
    esAdmin,
    puedeModificarItem,
    puedeEliminarItem,
    puedeCrearHijo,
    puedeCerrar,
    puedeReabrir,
    puedeGestionarCatalogo,
    puedeReordenar,
    puedeGestionarEquipo,
    puedeMarcarVisibilidad,
    puedeEditarObservacion,
    puedeEliminarObservacion,
  };
}

export default usePermisosTablero;
