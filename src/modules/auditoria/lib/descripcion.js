import {
  faPlus, faPen, faTrash, faArrowsUpDown, faCircleCheck, faRotateLeft,
  faEye, faPaperclip, faUserPlus, faUserMinus, faPalette, faTableColumns, faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';

// Cómo se lee cada acción en el feed. El log guarda verbos cortos; aquí se
// convierten en algo que una persona entienda sin conocer el modelo de datos.
const ACCIONES = {
  crear: { texto: 'creó', icon: faPlus, tono: 'neutro' },
  editar: { texto: 'editó', icon: faPen, tono: 'neutro' },
  eliminar: { texto: 'eliminó', icon: faTrash, tono: 'peligro' },
  reordenar: { texto: 'reordenó', icon: faArrowsUpDown, tono: 'tenue' },
  completar: { texto: 'completó', icon: faCircleCheck, tono: 'exito' },
  // Reabrir es el evento que más conflictos genera: se marca aparte para que
  // salte a la vista en el feed.
  reabrir: { texto: 'reabrió', icon: faRotateLeft, tono: 'alerta' },
  marcar_visto: { texto: 'confirmó haber visto', icon: faEye, tono: 'tenue' },
  adjuntar: { texto: 'adjuntó una imagen a', icon: faPaperclip, tono: 'neutro' },
  quitar_adjunto: { texto: 'quitó una imagen de', icon: faPaperclip, tono: 'peligro' },
  conceder_acceso: { texto: 'dio acceso a', icon: faUserPlus, tono: 'neutro' },
  revocar_acceso: { texto: 'quitó el acceso a', icon: faUserMinus, tono: 'peligro' },
  inicializar_tablero: { texto: 'inicializó', icon: faTableColumns, tono: 'tenue' },
  cambiar_branding: { texto: 'cambió la marca de', icon: faPalette, tono: 'neutro' },
};

const ENTIDADES = {
  Categoria: 'la categoría',
  Modulo: 'el módulo',
  Requerimiento: 'el requerimiento',
  ObservacionModulo: 'una observación del módulo',
  ObservacionRequerimiento: 'una observación',
  Estado: 'el estado',
  Prioridad: 'la prioridad',
  Tipo: 'el tipo',
  Usuario: 'el usuario',
  ColaboradorTablero: 'un colaborador',
  Tenant: 'la empresa',
  TableroPersonal: 'su tablero personal',
};

export function describirAccion(accion) {
  return ACCIONES[accion] ?? { texto: accion, icon: faClockRotateLeft, tono: 'neutro' };
}

export function describirEntidad(entidad) {
  return ENTIDADES[entidad] ?? entidad;
}

export const ACCIONES_DISPONIBLES = Object.entries(ACCIONES).map(([value, v]) => ({ value, label: v.texto }));
export const ENTIDADES_DISPONIBLES = Object.entries(ENTIDADES).map(([value, label]) => ({ value, label }));

// Colores por tono, para que el feed se lea de un vistazo.
export const TONOS = {
  neutro: 'text-cuarto/60 bg-cuarto/5 border-cuarto/10',
  tenue: 'text-cuarto/40 bg-cuarto/[0.03] border-cuarto/10',
  exito: 'text-segundo bg-segundo/10 border-segundo/25',
  alerta: 'text-tercero bg-tercero/10 border-tercero/30',
  peligro: 'text-quinto-claro bg-quinto/10 border-quinto/25',
};
