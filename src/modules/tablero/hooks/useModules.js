import { useState, useCallback } from 'react';
import moduleService from '../services/moduleService';

function useModules(categoriaId) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const fetchModules = useCallback(async () => {
    if (!categoriaId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await moduleService.getByCategory(categoriaId);
      setModules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [categoriaId]);

  const createModule = async (payload) => {
    setMutating(true);
    setError(null);
    try {
      const newModule = await moduleService.create(categoriaId, payload);
      setModules((prev) => [newModule, ...prev]);
      return newModule;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const updateModule = async (id, payload) => {
    setMutating(true);
    setError(null);
    try {
      const updated = await moduleService.updateDetail(id, payload);
      setModules((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeModule = async (id) => {
    setMutating(true);
    setError(null);
    try {
      await moduleService.remove(categoriaId, id);
      setModules((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const reorderModules = async (orderedIds) => {
    const previous = modules;
    setModules((prev) => orderedIds.map((id) => prev.find((m) => m.id === id)).filter(Boolean));
    try {
      await moduleService.reorder(categoriaId, orderedIds);
    } catch (err) {
      setModules(previous);
      setError(err.message);
      throw err;
    }
  };

  return { modules, loading, mutating, error, fetchModules, createModule, updateModule, removeModule, reorderModules };
}

export default useModules;
