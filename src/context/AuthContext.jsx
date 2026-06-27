import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../modules/auth/services/authService';
import { resetBrandingColors } from '../lib/applyBrandingColors';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPerfil = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await authService.getPerfil();
      setUsuario(data.usuario);
      setTenant(data.tenant);
    } catch {
      localStorage.removeItem('token');
      setUsuario(null);
      setTenant(null);
      resetBrandingColors();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerfil();
  }, [fetchPerfil]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    setUsuario(data.usuario);
    setTenant(data.tenant);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem('token', data.token);
    setUsuario(data.usuario);
    setTenant(data.tenant);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    setTenant(null);
    resetBrandingColors();
  };

  return (
    <AuthContext.Provider value={{ usuario, tenant, loading, login, register, logout, setTenant }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export { AuthProvider, useAuth };
