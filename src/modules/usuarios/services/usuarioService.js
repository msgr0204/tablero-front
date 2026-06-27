import apiClient from '../../../lib/apiClient';

function normalize(usuario) {
  return { ...usuario, id: usuario._id };
}

const usuarioService = {
  getAll: async () => {
    const { data } = await apiClient.get('/usuarios');
    return data.map(normalize);
  },

  create: async (payload) => {
    const { data } = await apiClient.post('/usuarios', payload);
    return normalize(data);
  },

  update: async (id, payload) => {
    const { data } = await apiClient.patch(`/usuarios/${id}`, payload);
    return normalize(data);
  },

  remove: async (id) => {
    await apiClient.delete(`/usuarios/${id}`);
  },
};

export default usuarioService;
