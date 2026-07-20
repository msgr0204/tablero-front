import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import estadoPrioridadService from '../services/estadoPrioridadService';

const EstadosPrioridadesContext = createContext(null);

function EstadosPrioridadesProvider({ children }) {
  const [estados, setEstados] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [estadosData, prioridadesData, tiposData] = await Promise.all([
        estadoPrioridadService.getEstados(),
        estadoPrioridadService.getPrioridades(),
        estadoPrioridadService.getTipos(),
      ]);
      setEstados(estadosData);
      setPrioridades(prioridadesData);
      setTipos(tiposData);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createEstado = async (payload) => {
    setMutating(true);
    setError(null);
    try {
      const nuevo = await estadoPrioridadService.createEstado(payload);
      setEstados((prev) => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const updateEstado = async (id, payload) => {
    setMutating(true);
    setError(null);
    try {
      const actualizado = await estadoPrioridadService.updateEstado(id, payload);
      setEstados((prev) => prev.map((e) => (e.id === id ? actualizado : e)));
      return actualizado;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeEstado = async (id) => {
    setMutating(true);
    setError(null);
    try {
      await estadoPrioridadService.removeEstado(id);
      setEstados((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const reorderEstados = async (orderedIds) => {
    const previous = estados;
    setEstados((prev) => orderedIds.map((id) => prev.find((e) => e.id === id)).filter(Boolean));
    try {
      await estadoPrioridadService.reorderEstados(orderedIds);
    } catch (err) {
      setEstados(previous);
      setError(err.response?.data?.message ?? err.message);
      throw err;
    }
  };

  const createPrioridad = async (payload) => {
    setMutating(true);
    setError(null);
    try {
      const nueva = await estadoPrioridadService.createPrioridad(payload);
      setPrioridades((prev) => [...prev, nueva]);
      return nueva;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const updatePrioridad = async (id, payload) => {
    setMutating(true);
    setError(null);
    try {
      const actualizada = await estadoPrioridadService.updatePrioridad(id, payload);
      setPrioridades((prev) => prev.map((p) => (p.id === id ? actualizada : p)));
      return actualizada;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removePrioridad = async (id) => {
    setMutating(true);
    setError(null);
    try {
      await estadoPrioridadService.removePrioridad(id);
      setPrioridades((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const reorderPrioridades = async (orderedIds) => {
    const previous = prioridades;
    setPrioridades((prev) => orderedIds.map((id) => prev.find((p) => p.id === id)).filter(Boolean));
    try {
      await estadoPrioridadService.reorderPrioridades(orderedIds);
    } catch (err) {
      setPrioridades(previous);
      setError(err.response?.data?.message ?? err.message);
      throw err;
    }
  };

  const createTipo = async (payload) => {
    setMutating(true);
    setError(null);
    try {
      const nuevo = await estadoPrioridadService.createTipo(payload);
      setTipos((prev) => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const updateTipo = async (id, payload) => {
    setMutating(true);
    setError(null);
    try {
      const actualizado = await estadoPrioridadService.updateTipo(id, payload);
      setTipos((prev) => prev.map((t) => (t.id === id ? actualizado : t)));
      return actualizado;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeTipo = async (id) => {
    setMutating(true);
    setError(null);
    try {
      await estadoPrioridadService.removeTipo(id);
      setTipos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const reorderTipos = async (orderedIds) => {
    const previous = tipos;
    setTipos((prev) => orderedIds.map((id) => prev.find((t) => t.id === id)).filter(Boolean));
    try {
      await estadoPrioridadService.reorderTipos(orderedIds);
    } catch (err) {
      setTipos(previous);
      setError(err.response?.data?.message ?? err.message);
      throw err;
    }
  };

  const getEstado = (id) => {
    if (!id) return null;
    return estados.find((e) => e.id === id) ?? null;
  };
  const getPrioridad = (id) => {
    if (!id) return null;
    return prioridades.find((p) => p.id === id) ?? null;
  };
  const getTipo = (id) => {
    if (!id) return null;
    return tipos.find((t) => t.id === id) ?? null;
  };
  const esEstadoFinal = (id) => getEstado(id)?.es_estado_final ?? false;

  return (
    <EstadosPrioridadesContext.Provider value={{
      estados, prioridades, tipos, loading, mutating, error, fetchAll,
      createEstado, updateEstado, removeEstado, reorderEstados,
      createPrioridad, updatePrioridad, removePrioridad, reorderPrioridades,
      createTipo, updateTipo, removeTipo, reorderTipos,
      getEstado, getPrioridad, getTipo, esEstadoFinal,
      estadoDefault: estados[0]?.id ?? null,
      prioridadDefault: prioridades[0]?.id ?? null,
      tipoDefault: tipos[0]?.id ?? null,
    }}>
      {children}
    </EstadosPrioridadesContext.Provider>
  );
}

function useEstadosPrioridades() {
  const ctx = useContext(EstadosPrioridadesContext);
  if (!ctx) throw new Error('useEstadosPrioridades debe usarse dentro de EstadosPrioridadesProvider');
  return ctx;
}

export { EstadosPrioridadesProvider, useEstadosPrioridades };
