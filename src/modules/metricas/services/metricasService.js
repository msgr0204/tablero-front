import apiClient from '../../../lib/apiClient';

const metricasService = {
  getMetricas: async () => {
    const { data } = await apiClient.get('/metricas');
    return data;
  },
};

export default metricasService;
