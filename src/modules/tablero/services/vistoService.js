import apiClient from '../../../lib/apiClient';

// Acuse de recibo (solo tablero de empresa). entidad: 'Categoria' | 'Modulo'.
const vistoService = {
  marcar: async (entidad, entidadId) => {
    const { data } = await apiClient.post(`/visto/${entidad}/${entidadId}`);
    return data;
  },

  // Trazabilidad: quiénes vieron y quiénes faltan.
  getDetalle: async (entidad, entidadId) => {
    const { data } = await apiClient.get(`/visto/${entidad}/${entidadId}`);
    return data;
  },
};

export default vistoService;
