import apiClient from '../../../lib/apiClient';
import normalizeDate from '../../../lib/normalizeDate';

function normalizeObservacion(obs) {
  return { ...obs, id: obs._id };
}

function normalizeAdjunto(adjunto) {
  return { ...adjunto, id: adjunto._id };
}

function normalizeRequerimiento(req) {
  return {
    ...req,
    id: req._id,
    fecha_entrega: normalizeDate(req.fecha_entrega),
    observaciones: (req.observaciones ?? []).map(normalizeObservacion),
    adjuntos: (req.adjuntos ?? []).map(normalizeAdjunto),
  };
}

function normalizeModulo(modulo) {
  return {
    ...modulo,
    id: modulo._id,
    fecha_entrega: normalizeDate(modulo.fecha_entrega),
    requerimientos: (modulo.requerimientos ?? []).map(normalizeRequerimiento),
    observaciones: (modulo.observaciones ?? []).map(normalizeObservacion),
  };
}

const moduleService = {
  getByCategory: async (categoriaId) => {
    const { data } = await apiClient.get(`/modulos/categoria/${categoriaId}`);
    return data.map(normalizeModulo);
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/modulos/${id}`);
    return normalizeModulo(data);
  },

  create: async (categoriaId, payload) => {
    const { data } = await apiClient.post(`/modulos/categoria/${categoriaId}`, payload);
    return normalizeModulo(data);
  },

  updateDetail: async (id, payload) => {
    const { data } = await apiClient.patch(`/modulos/${id}`, payload);
    return normalizeModulo(data);
  },

  remove: async (categoriaId, id) => {
    await apiClient.delete(`/modulos/${id}`);
  },

  reorder: async (categoriaId, orderedIds) => {
    const { data } = await apiClient.post(`/modulos/categoria/${categoriaId}/reorder`, { orderedIds });
    return data.map(normalizeModulo);
  },

  addRequirement: async (moduleId, payload) => {
    const { data } = await apiClient.post(`/modulos/${moduleId}/requirements`, payload);
    return normalizeRequerimiento(data);
  },

  updateRequirement: async (moduleId, reqId, payload) => {
    const { data } = await apiClient.patch(`/modulos/requirements/${reqId}`, payload);
    return normalizeRequerimiento(data);
  },

  removeRequirement: async (moduleId, reqId) => {
    await apiClient.delete(`/modulos/requirements/${reqId}`);
  },

  reorderRequirements: async (moduleId, orderedIds) => {
    const { data } = await apiClient.post(`/modulos/${moduleId}/requirements/reorder`, { orderedIds });
    return data.map(normalizeRequerimiento);
  },

  toggleCompletado: async (moduleId, reqId, completado, estadoRestaurado) => {
    const { data } = await apiClient.patch(`/modulos/requirements/${reqId}/toggle-complete`, {
      completado,
      estadoRestaurado,
    });
    return normalizeRequerimiento(data);
  },

  addModuleObservation: async (moduleId, texto) => {
    const { data } = await apiClient.post(`/modulos/${moduleId}/observations`, { texto });
    return normalizeObservacion(data);
  },

  removeModuleObservation: async (moduleId, obsId) => {
    await apiClient.delete(`/modulos/${moduleId}/observations/${obsId}`);
  },

  addReqObservation: async (moduleId, reqId, texto) => {
    const { data } = await apiClient.post(`/modulos/requirements/${reqId}/observations`, { texto });
    return normalizeObservacion(data);
  },

  removeReqObservation: async (moduleId, reqId, obsId) => {
    await apiClient.delete(`/modulos/requirements/${reqId}/observations/${obsId}`);
  },

  addAdjunto: async (moduleId, reqId, archivo) => {
    const formData = new FormData();
    formData.append('archivo', archivo);
    const { data } = await apiClient.post(`/modulos/requirements/${reqId}/adjuntos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return normalizeRequerimiento(data);
  },

  removeAdjunto: async (moduleId, reqId, adjuntoId) => {
    const { data } = await apiClient.delete(`/modulos/requirements/${reqId}/adjuntos/${adjuntoId}`);
    return normalizeRequerimiento(data);
  },
};

export default moduleService;
