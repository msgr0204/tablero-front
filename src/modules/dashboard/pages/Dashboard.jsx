import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import AppHeader from '../../../components/AppHeader';
import FilterDropdown from '../../../components/FilterDropdown';
import ResumenCards from '../components/ResumenCards';
import DistribucionChart from '../components/DistribucionChart';
import CargaCategoriaChart from '../components/CargaCategoriaChart';
import EvolucionChart from '../components/EvolucionChart';
import TiempoPorEstadoChart from '../components/TiempoPorEstadoChart';
import useDashboard from '../hooks/useDashboard';
import useCategories from '../../tablero/hooks/useCategories';
import { useBranding } from '../../../context/BrandingContext';

function Dashboard() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const [categoriaId, setCategoriaId] = useState('');
  const { categories, fetchCategories } = useCategories();
  const { data, loading, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchDashboard(categoriaId || null);
  }, [categoriaId, fetchDashboard]);

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
            Dashboard ejecutivo
          </h1>
        </div>
        <FilterDropdown
          icon={faLayerGroup}
          value={categoriaId}
          onChange={setCategoriaId}
          placeholder="Todas las categorías"
          options={[{ value: '', label: 'Todas las categorías' }, ...categories.map((c) => ({ value: c.id, label: c.nombre }))]}
        />
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] py-[1.25em] sm:py-[1.75em] max-w-[90em] mx-auto flex flex-col gap-[1.5em]">
        {loading && !data ? (
          <div className="flex items-center justify-center py-[6em]">
            <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
          </div>
        ) : data ? (
          <>
            <ResumenCards resumen={data.resumen} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.25em]">
              <DistribucionChart titulo="Por estado" datos={data.porEstado} />
              <DistribucionChart titulo="Por prioridad" datos={data.porPrioridad} />
            </div>

            <EvolucionChart datos={data.evolucionSemanal} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.25em]">
              {!categoriaId && <CargaCategoriaChart datos={data.porCategoria} />}
              <TiempoPorEstadoChart datos={data.tiempoPorEstado} />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default Dashboard;
