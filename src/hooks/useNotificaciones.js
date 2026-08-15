import { useState, useCallback } from 'react';
import notificacionService from '../services/notificacionService';

function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [historial, setHistorial] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const fetchNoLeidas = useCallback(async () => {
    try {
      const total = await notificacionService.contarNoLeidas();
      setNoLeidas(total);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    }
  }, []);

  const fetchNotificaciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificacionService.getAll();
      setNotificaciones(data);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistorial = useCallback(async (paginaSolicitada = 1) => {
    setLoadingHistorial(true);
    setError(null);
    try {
      const data = await notificacionService.getHistorial(paginaSolicitada, 20);
      setHistorial(data.notificaciones);
      setPagina(data.pagina);
      setTotalPaginas(data.totalPaginas);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoadingHistorial(false);
    }
  }, []);

  const marcarLeida = async (id) => {
    try {
      await notificacionService.marcarLeida(id);
      setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
      setHistorial((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
      setNoLeidas((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      await notificacionService.marcarTodasLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
      setHistorial((prev) => prev.map((n) => ({ ...n, leida: true })));
      setNoLeidas(0);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    }
  };

  const marcarVariasLeidas = async (ids) => {
    try {
      const total = await notificacionService.marcarVariasLeidas(ids);
      const seleccion = new Set(ids);
      setNotificaciones((prev) => prev.map((n) => (seleccion.has(n.id) ? { ...n, leida: true } : n)));
      setHistorial((prev) => prev.map((n) => (seleccion.has(n.id) ? { ...n, leida: true } : n)));
      setNoLeidas((prev) => Math.max(0, prev - total));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    }
  };

  return {
    notificaciones, noLeidas, loading, error,
    historial, pagina, totalPaginas, loadingHistorial,
    fetchNoLeidas, fetchNotificaciones, fetchHistorial,
    marcarLeida, marcarTodasLeidas, marcarVariasLeidas,
  };
}

export default useNotificaciones;
