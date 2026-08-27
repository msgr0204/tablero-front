import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:2406/api',
});

// El ámbito activo (empresa/personal) viaja en cada request como header. Se lee
// de localStorage para que el interceptor —que vive fuera de React— siempre use
// el contexto vigente sin depender del árbol de componentes. Default: empresa.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Ambito'] = localStorage.getItem('ambito') === 'personal' ? 'personal' : 'empresa';
  return config;
});

export default apiClient;
