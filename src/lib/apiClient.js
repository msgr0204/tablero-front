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
  const ambito = localStorage.getItem('ambito') === 'personal' ? 'personal' : 'empresa';
  config.headers['X-Ambito'] = ambito;
  // En ámbito personal, si estoy viendo el tablero de otro usuario (me lo
  // compartió), su id viaja como X-Owner-Id; el backend valida el acceso.
  if (ambito === 'personal') {
    const ownerId = localStorage.getItem('owner_id');
    if (ownerId) config.headers['X-Owner-Id'] = ownerId;
  }
  return config;
});

export default apiClient;
