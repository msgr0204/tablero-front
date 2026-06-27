import apiClient from '../../../lib/apiClient';

const authService = {
  login: async ({ email, password }) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  register: async ({ nombre, email, password, nombreEmpresa }) => {
    const { data } = await apiClient.post('/auth/register', { nombre, email, password, nombreEmpresa });
    return data;
  },

  getPerfil: async () => {
    const { data } = await apiClient.get('/auth/perfil');
    return data;
  },

  getPlantillasBranding: async () => {
    const { data } = await apiClient.get('/plantillas-branding');
    return data;
  },

  aplicarPlantillaBranding: async (plantillaId) => {
    const { data } = await apiClient.patch('/tenant/branding', { plantillaId });
    return data;
  },

  subirLogo: async (archivo) => {
    const formData = new FormData();
    formData.append('logo', archivo);
    const { data } = await apiClient.patch('/tenant/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

export default authService;
