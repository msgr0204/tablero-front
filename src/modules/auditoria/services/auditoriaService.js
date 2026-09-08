import apiClient from '../../../lib/apiClient';

const auditoriaService = {
  // Feed general del tenant, paginado y filtrable.
  listar: async (params = {}) => {
    const { data } = await apiClient.get('/auditoria', { params });
    return data;
  },

  // Mi actividad: el backend fuerza el actor al usuario del token.
  mias: async (params = {}) => {
    const { data } = await apiClient.get('/auditoria/mias', { params });
    return data;
  },

  // Personas presentes en el log, para poblar el filtro.
  actores: async () => {
    const { data } = await apiClient.get('/auditoria/actores');
    return data;
  },

  historialDe: async (entidad, entidadId) => {
    const { data } = await apiClient.get(`/auditoria/entidad/${entidad}/${entidadId}`);
    return data;
  },

  vistasDe: async (entidad, entidadId) => {
    const { data } = await apiClient.get(`/auditoria/vistas/${entidad}/${entidadId}`);
    return data;
  },

  // Registrar una apertura. Se lanza sin await desde la interfaz: si falla, no
  // debe interrumpir la navegación de quien está leyendo.
  registrarVista: (entidad, entidad_id, entidad_nombre) =>
    apiClient.post('/auditoria/vista', { entidad, entidad_id, entidad_nombre }).catch(() => {}),
};

export default auditoriaService;
