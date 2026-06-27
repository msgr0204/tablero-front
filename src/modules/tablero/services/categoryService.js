import apiClient from '../../../lib/apiClient';
import normalizeDate from '../../../lib/normalizeDate';

function normalize(categoria) {
  return { ...categoria, id: categoria._id, fecha_entrega: normalizeDate(categoria.fecha_entrega) };
}

const categoryService = {
  getAll: async () => {
    const { data } = await apiClient.get('/categorias');
    return data.map(normalize);
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/categorias/${id}`);
    return normalize(data);
  },

  create: async (payload) => {
    const { data } = await apiClient.post('/categorias', payload);
    return normalize(data);
  },

  update: async (id, payload) => {
    const { data } = await apiClient.patch(`/categorias/${id}`, payload);
    return normalize(data);
  },

  remove: async (id) => {
    await apiClient.delete(`/categorias/${id}`);
  },

  reorder: async (orderedIds) => {
    const { data } = await apiClient.post('/categorias/reorder', { orderedIds });
    return data.map(normalize);
  },
};

export default categoryService;
