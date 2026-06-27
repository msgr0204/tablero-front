import { useState, useCallback } from 'react';
import usuarioService from '../services/usuarioService';

function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUsuario = async (payload) => {
    setMutating(true);
    setError(null);
    try {
      const nuevo = await usuarioService.create(payload);
      setUsuarios((prev) => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const updateUsuario = async (id, payload) => {
    setMutating(true);
    setError(null);
    try {
      const actualizado = await usuarioService.update(id, payload);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? actualizado : u)));
      return actualizado;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeUsuario = async (id) => {
    setMutating(true);
    setError(null);
    try {
      await usuarioService.remove(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  return { usuarios, loading, mutating, error, fetchUsuarios, createUsuario, updateUsuario, removeUsuario };
}

export default useUsuarios;
