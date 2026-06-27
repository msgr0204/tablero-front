import apiClient from '../lib/apiClient';

function normalize(notificacion) {
  return { ...notificacion, id: notificacion._id };
}

const notificacionService = {
  getAll: async () => {
    const { data } = await apiClient.get('/notificaciones');
    return data.map(normalize);
  },

  contarNoLeidas: async () => {
    const { data } = await apiClient.get('/notificaciones/no-leidas/count');
    return data.total;
  },

  marcarLeida: async (id) => {
    const { data } = await apiClient.patch(`/notificaciones/${id}/leer`);
    return normalize(data);
  },

  getHistorial: async (pagina = 1, porPagina = 20) => {
    const { data } = await apiClient.get('/notificaciones/historial', { params: { pagina, porPagina } });
    return { ...data, notificaciones: data.notificaciones.map(normalize) };
  },
};

export default notificacionService;
