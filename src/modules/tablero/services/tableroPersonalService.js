import apiClient from '../../../lib/apiClient';

const tableroPersonalService = {
  // Clona los catálogos de la empresa al ámbito personal si aún no existen.
  // Idempotente en el backend; se llama al entrar a "Mi tablero".
  inicializar: async () => {
    const { data } = await apiClient.post('/tablero-personal/inicializar');
    return data;
  },
};

export default tableroPersonalService;
