import apiClient from '../../../lib/apiClient';

const colaboradorService = {
  // Usuarios del tenant con flag de si tienen acceso a MI tablero.
  getEquipo: async () => {
    const { data } = await apiClient.get('/colaboradores/equipo');
    return data;
  },

  conceder: async (colaboradorId) => {
    const { data } = await apiClient.post(`/colaboradores/equipo/${colaboradorId}`);
    return data;
  },

  revocar: async (colaboradorId) => {
    const { data } = await apiClient.delete(`/colaboradores/equipo/${colaboradorId}`);
    return data;
  },

  // Tableros de otros a los que tengo acceso (para el selector).
  getCompartidosConmigo: async () => {
    const { data } = await apiClient.get('/colaboradores/compartidos-conmigo');
    return data;
  },
};

export default colaboradorService;
