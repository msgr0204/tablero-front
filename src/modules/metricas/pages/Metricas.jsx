import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AppHeader from '../../../components/AppHeader';
import VencimientosList from '../components/VencimientosList';
import SinActividadList from '../components/SinActividadList';
import SaludCatalogos from '../components/SaludCatalogos';
import CalidadObservaciones from '../components/CalidadObservaciones';
import useMetricas from '../hooks/useMetricas';
import { useBranding } from '../../../context/BrandingContext';

function Metricas() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const { data, loading, fetchMetricas } = useMetricas();

  useEffect(() => {
    fetchMetricas();
  }, [fetchMetricas]);

  return (
    <div className="min-h-dvh bg-primero text-cuarto font-roboto">
      <AppHeader logoUrl={branding?.logoUrl} nombreMarca={branding?.nombreMarca}>
        <div className="flex items-center gap-[0.5em] sm:gap-[0.75em] min-w-0">
          <button
            onClick={() => navigate('/tablero')}
            aria-label="Volver al tablero"
            className="w-[2.5em] h-[2.5em] flex items-center justify-center rounded-[0.5em] text-cuarto/40 hover:text-segundo hover:bg-segundo/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-[0.85em]" />
          </button>
          <h1 className="text-[0.9em] sm:text-[1.05em] font-semibold font-poppins text-cuarto tracking-tight truncate">
            Métricas
          </h1>
        </div>
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] py-[1.25em] sm:py-[1.75em] max-w-[90em] mx-auto flex flex-col gap-[1.5em]">
        {loading && !data ? (
          <div className="flex items-center justify-center py-[6em]">
            <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.25em]">
              <VencimientosList items={data.vencimientos} />
              <SinActividadList items={data.sinActividad} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.25em]">
              <SaludCatalogos datos={data.saludCatalogos} />
              <CalidadObservaciones datos={data.calidadObservaciones} />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default Metricas;
