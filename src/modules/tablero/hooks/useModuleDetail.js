import { useState, useCallback } from 'react';
import moduleService from '../services/moduleService';

function useModuleDetail(moduleId) {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const fetchModule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await moduleService.getById(moduleId);
      setModule(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  const updateDetail = async (payload) => {
    setMutating(true);
    setError(null);
    try {
      const updated = await moduleService.updateDetail(moduleId, payload);
      setModule((prev) => ({ ...prev, ...updated }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const addRequirement = async (payload) => {
    setMutating(true);
    setError(null);
    try {
      const req = await moduleService.addRequirement(moduleId, payload);
      setModule((prev) => ({ ...prev, requerimientos: [...(prev.requerimientos ?? []), req] }));
      return req;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const updateRequirement = async (reqId, payload) => {
    setMutating(true);
    setError(null);
    try {
      const updated = await moduleService.updateRequirement(moduleId, reqId, payload);
      setModule((prev) => ({
        ...prev,
        requerimientos: prev.requerimientos.map((r) => (r.id === reqId ? updated : r)),
      }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeRequirement = async (reqId) => {
    setMutating(true);
    setError(null);
    try {
      await moduleService.removeRequirement(moduleId, reqId);
      setModule((prev) => ({ ...prev, requerimientos: prev.requerimientos.filter((r) => r.id !== reqId) }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const reorderRequirements = async (orderedIds) => {
    const previous = module.requerimientos;
    setModule((prev) => ({
      ...prev,
      requerimientos: orderedIds.map((id) => prev.requerimientos.find((r) => r.id === id)).filter(Boolean),
    }));
    try {
      await moduleService.reorderRequirements(moduleId, orderedIds);
    } catch (err) {
      setModule((prev) => ({ ...prev, requerimientos: previous }));
      setError(err.message);
      throw err;
    }
  };

  const toggleCompletado = async (reqId, completado, estadoRestaurado) => {
    setMutating(true);
    setError(null);
    try {
      const updated = await moduleService.toggleCompletado(moduleId, reqId, completado, estadoRestaurado);
      setModule((prev) => ({
        ...prev,
        requerimientos: prev.requerimientos.map((r) => (r.id === reqId ? updated : r)),
      }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const addModuleObservation = async (texto) => {
    setMutating(true);
    setError(null);
    try {
      const obs = await moduleService.addModuleObservation(moduleId, texto);
      setModule((prev) => ({ ...prev, observaciones: [...(prev.observaciones ?? []), obs] }));
      return obs;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeModuleObservation = async (obsId) => {
    setMutating(true);
    setError(null);
    try {
      await moduleService.removeModuleObservation(moduleId, obsId);
      setModule((prev) => ({ ...prev, observaciones: (prev.observaciones ?? []).filter((o) => o.id !== obsId) }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const addReqObservation = async (reqId, texto) => {
    setMutating(true);
    setError(null);
    try {
      const obs = await moduleService.addReqObservation(moduleId, reqId, texto);
      setModule((prev) => ({
        ...prev,
        requerimientos: prev.requerimientos.map((r) =>
          r.id === reqId ? { ...r, observaciones: [...(r.observaciones ?? []), obs] } : r
        ),
      }));
      return obs;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeReqObservation = async (reqId, obsId) => {
    setMutating(true);
    setError(null);
    try {
      await moduleService.removeReqObservation(moduleId, reqId, obsId);
      setModule((prev) => ({
        ...prev,
        requerimientos: prev.requerimientos.map((r) =>
          r.id === reqId ? { ...r, observaciones: (r.observaciones ?? []).filter((o) => o.id !== obsId) } : r
        ),
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const addAdjunto = async (reqId, archivo) => {
    setMutating(true);
    setError(null);
    try {
      const updated = await moduleService.addAdjunto(moduleId, reqId, archivo);
      setModule((prev) => ({
        ...prev,
        requerimientos: prev.requerimientos.map((r) => (r.id === reqId ? updated : r)),
      }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeAdjunto = async (reqId, adjuntoId) => {
    setMutating(true);
    setError(null);
    try {
      const updated = await moduleService.removeAdjunto(moduleId, reqId, adjuntoId);
      setModule((prev) => ({
        ...prev,
        requerimientos: prev.requerimientos.map((r) => (r.id === reqId ? updated : r)),
      }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  return {
    module, loading, mutating, error, fetchModule, updateDetail,
    addRequirement, updateRequirement, removeRequirement, reorderRequirements, toggleCompletado,
    addModuleObservation, removeModuleObservation, addReqObservation, removeReqObservation,
    addAdjunto, removeAdjunto,
  };
}

export default useModuleDetail;
