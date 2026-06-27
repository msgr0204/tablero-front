import { useState, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async (categoriaId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardService.getDashboard(categoriaId);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchDashboard };
}

export default useDashboard;
