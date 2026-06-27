import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faArrowLeft, faArrowRight, faSpinner, faUpload, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import authService from '../services/authService';
import { useAuth } from '../../../context/AuthContext';
import applyBrandingColors from '../../../lib/applyBrandingColors';
import PlantillaCard from '../components/PlantillaCard';

function SeleccionarPlantilla() {
  const navigate = useNavigate();
  const { tenant, setTenant } = useAuth();
  const esReseleccion = tenant?.personalizado === true;
  const [plantillas, setPlantillas] = useState([]);
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [error, setError] = useState(null);
  const inputLogoRef = useRef(null);

  useEffect(() => {
    authService.getPlantillasBranding()
      .then(setPlantillas)
      .catch((err) => setError(err.response?.data?.message ?? err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubirLogo = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;

    setSubiendoLogo(true);
    setError(null);
    try {
      const tenantActualizado = await authService.subirLogo(archivo);
      setTenant(tenantActualizado);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setSubiendoLogo(false);
    }
  };

  const handleContinuar = async () => {
    if (!seleccionadaId) return;
    setGuardando(true);
    setError(null);
    try {
      const tenantActualizado = await authService.aplicarPlantillaBranding(seleccionadaId);
      setTenant(tenantActualizado);
      applyBrandingColors(tenantActualizado.colors);
      navigate('/tablero', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-primero-oscuro p-[1.5em] sm:p-[2.5em] font-roboto">
      <div className="max-w-[64em] mx-auto">
        {esReseleccion && (
          <button
            type="button"
            onClick={() => navigate('/tablero')}
            className="flex items-center gap-[0.5em] text-cuarto/60 hover:text-cuarto text-[0.85em] font-roboto transition-colors mb-[1.5em]"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver al tablero
          </button>
        )}

        <h1 className="text-[1.6em] font-bold font-poppins text-cuarto mb-[0.3em]">
          Elige el estilo de {tenant?.nombre}
        </h1>
        <p className="text-[0.9em] text-cuarto/50 mb-[1.5em]">
          Puedes ver cómo se vería tu tablero con cada paleta antes de continuar.
        </p>

        <div className="flex items-center gap-[1em] mb-[1.5em] p-[1em] rounded-[0.75em] bg-primero border border-cuarto/10">
          <div className="w-[3.5em] h-[3.5em] rounded-[0.6em] bg-primero-fuerte flex items-center justify-center flex-shrink-0 overflow-hidden">
            {tenant?.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant?.nombre} className="w-full h-full object-contain p-[0.4em]" draggable={false} />
            ) : (
              <FontAwesomeIcon icon={faBuilding} className="text-[1.2em] text-cuarto/30" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.85em] font-poppins font-semibold text-cuarto">Logo de la empresa</p>
            <p className="text-[0.75em] text-cuarto/40">JPG, PNG o WEBP. Se mostrará en la barra superior del tablero.</p>
          </div>
          <input ref={inputLogoRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleSubirLogo} className="hidden" />
          <button
            type="button"
            onClick={() => inputLogoRef.current?.click()}
            disabled={subiendoLogo}
            className="inline-flex items-center gap-[0.5em] px-[1em] py-[0.6em] rounded-[0.6em] bg-primero-fuerte text-cuarto font-poppins font-medium text-[0.85em] hover:bg-cuarto/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <FontAwesomeIcon icon={subiendoLogo ? faSpinner : faUpload} spin={subiendoLogo} className="text-[0.85em]" />
            {subiendoLogo ? 'Subiendo...' : tenant?.logoUrl ? 'Cambiar logo' : 'Subir logo'}
          </button>
        </div>

        {error && (
          <div className="mb-[1em] px-[1em] py-[0.75em] rounded-[0.6em] bg-quinto/10 border border-quinto/30 text-quinto-claro text-[0.85em]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-[4em] text-cuarto/40">
            <FontAwesomeIcon icon={faSpinner} spin className="text-[1.5em]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[1em]">
            {plantillas.map((plantilla) => (
              <PlantillaCard
                key={plantilla.id}
                plantilla={plantilla}
                seleccionada={seleccionadaId === plantilla.id}
                onSelect={setSeleccionadaId}
              />
            ))}
          </div>
        )}

        <div className="flex justify-end mt-[2em]">
          <button
            type="button"
            onClick={handleContinuar}
            disabled={!seleccionadaId || guardando}
            className="inline-flex items-center gap-[0.6em] px-[1.5em] py-[0.75em] rounded-[0.7em] bg-segundo text-primero font-poppins font-semibold text-[0.9em] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {guardando ? 'Guardando...' : esReseleccion ? 'Guardar cambios' : 'Continuar al tablero'}
            <FontAwesomeIcon icon={faArrowRight} className="text-[0.85em]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeleccionarPlantilla;
