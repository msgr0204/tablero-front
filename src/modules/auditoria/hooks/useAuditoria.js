import { useState, useCallback, useRef } from 'react';
import auditoriaService from '../services/auditoriaService';

// Carga el feed (general o personal) con sus filtros. La página decide cuál de
// los dos pide; el hook no distingue más allá del flag `soloMias`.
function useAuditoria() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pagina: 1, totalPaginas: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Evita que una respuesta lenta pise a otra más reciente al cambiar filtros
  // rápido: solo se aplica la última petición lanzada.
  const peticionActual = useRef(0);

  const cargar = useCallback(async (params = {}, soloMias = false) => {
    const id = ++peticionActual.current;
    setLoading(true);
    setError('');
    try {
      const data = soloMias ? await auditoriaService.mias(params) : await auditoriaService.listar(params);
      if (id !== peticionActual.current) return;
      setItems(data.items ?? []);
      setMeta({ total: data.total ?? 0, pagina: data.pagina ?? 1, totalPaginas: data.totalPaginas ?? 1 });
    } catch (err) {
      if (id !== peticionActual.current) return;
      setError(err.response?.data?.message ?? err.message);
      setItems([]);
    } finally {
      if (id === peticionActual.current) setLoading(false);
    }
  }, []);

  return { items, meta, loading, error, cargar };
}

export default useAuditoria;
