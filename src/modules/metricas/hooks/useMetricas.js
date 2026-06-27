import { useState, useCallback } from 'react';
import metricasService from '../services/metricasService';

function useMetricas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetricas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await metricasService.getMetricas();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchMetricas };
}

export default useMetricas;
