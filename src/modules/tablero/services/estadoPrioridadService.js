import apiClient from '../../../lib/apiClient';

function normalize(item) {
  return { ...item, id: item._id };
}

const estadoPrioridadService = {
  getEstados: async () => {
    const { data } = await apiClient.get('/estados');
    return data.map(normalize);
  },

  createEstado: async (payload) => {
    const { data } = await apiClient.post('/estados', payload);
    return normalize(data);
  },

  updateEstado: async (id, payload) => {
    const { data } = await apiClient.patch(`/estados/${id}`, payload);
    return normalize(data);
  },

  removeEstado: async (id) => {
    await apiClient.delete(`/estados/${id}`);
  },

  reorderEstados: async (orderedIds) => {
    const { data } = await apiClient.post('/estados/reorder', { orderedIds });
    return data.map(normalize);
  },

  getPrioridades: async () => {
    const { data } = await apiClient.get('/prioridades');
    return data.map(normalize);
  },

  createPrioridad: async (payload) => {
    const { data } = await apiClient.post('/prioridades', payload);
    return normalize(data);
  },

  updatePrioridad: async (id, payload) => {
    const { data } = await apiClient.patch(`/prioridades/${id}`, payload);
    return normalize(data);
  },

  removePrioridad: async (id) => {
    await apiClient.delete(`/prioridades/${id}`);
  },

  reorderPrioridades: async (orderedIds) => {
    const { data } = await apiClient.post('/prioridades/reorder', { orderedIds });
    return data.map(normalize);
  },
};

export default estadoPrioridadService;
