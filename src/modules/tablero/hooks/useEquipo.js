import { useState, useCallback } from 'react';
import colaboradorService from '../services/colaboradorService';

// Gestiona el equipo de MI tablero: lista de usuarios del tenant con su flag de
// acceso, y conceder/revocar. Actualización optimista del flag por usuario.
function useEquipo() {
  const [equipo, setEquipo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutandoId, setMutandoId] = useState(null);
  const [error, setError] = useState(null);

  const fetchEquipo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await colaboradorService.getEquipo();
      setEquipo(data);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleAcceso = async (colaborador) => {
    setMutandoId(colaborador.id);
    setError(null);
    const conceder = !colaborador.tieneAcceso;
    try {
      if (conceder) await colaboradorService.conceder(colaborador.id);
      else await colaboradorService.revocar(colaborador.id);
      setEquipo((prev) => prev.map((u) => (u.id === colaborador.id ? { ...u, tieneAcceso: conceder } : u)));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutandoId(null);
    }
  };

  return { equipo, loading, mutandoId, error, fetchEquipo, toggleAcceso };
}

export default useEquipo;
