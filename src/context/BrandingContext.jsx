import { createContext, useContext, useState, useEffect } from 'react';
import applyBrandingColors from '../lib/applyBrandingColors';
import { useAuth } from './AuthContext';

const BrandingContext = createContext(null);

/**
 * Estado global del branding por tenant (logo + colores). Se sincroniza
 * automáticamente con el tenant autenticado: cuando AuthContext resuelve
 * el tenant (tras login/registro/recarga de sesión), las variables CSS
 * del tema se actualizan sin que ningún componente tenga que llamarlo.
 */
function BrandingProvider({ children }) {
  const { tenant } = useAuth();
  const [branding, setBrandingState] = useState(null);

  useEffect(() => {
    if (!tenant) return;
    const data = { logoUrl: tenant.logoUrl, nombreMarca: tenant.nombre, colors: tenant.colors ?? {} };
    applyBrandingColors(data.colors);
    setBrandingState(data);
  }, [tenant]);

  const setBranding = (data) => {
    if (data?.colors) applyBrandingColors(data.colors);
    setBrandingState(data);
  };

  return (
    <BrandingContext.Provider value={{ branding, setBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

function useBranding() {
  const ctx = useContext(BrandingContext);
  if (!ctx) throw new Error('useBranding debe usarse dentro de BrandingProvider');
  return ctx;
}

export { BrandingProvider, useBranding };
