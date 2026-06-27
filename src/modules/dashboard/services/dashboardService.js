import apiClient from '../../../lib/apiClient';

const dashboardService = {
  getDashboard: async (categoriaId) => {
    const { data } = await apiClient.get('/dashboard', { params: categoriaId ? { categoriaId } : {} });
    return data;
  },
};

export default dashboardService;
