import { faBell, faFolder, faCubes, faListCheck, faCommentDots } from '@fortawesome/free-solid-svg-icons';

const ICONOS_POR_ENTIDAD = {
  Categoria: faFolder,
  Modulo: faCubes,
  Requerimiento: faListCheck,
  ObservacionModulo: faCommentDots,
  ObservacionRequerimiento: faCommentDots,
};

function iconoEntidad(entidad) {
  return ICONOS_POR_ENTIDAD[entidad] ?? faBell;
}

function tiempoRelativo(fecha) {
  const segundos = Math.floor((Date.now() - new Date(fecha).getTime()) / 1000);
  if (segundos < 60) return 'hace un momento';
  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} d`;
}

export { iconoEntidad, tiempoRelativo };
