import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCubes, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import AppHeader from '../../../components/AppHeader';
import { useBranding } from '../../../context/BrandingContext';
import colaboradorService from '../services/colaboradorService';
import { EquiposSkeleton } from '../components/TableroSkeletons';

// Galería de los tableros a los que tengo acceso (los que otros me compartieron).
// Espacio dedicado, en cards, en vez de un selector apretado en el header.
function Equipos() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const [tableros, setTableros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;
    colaboradorService.getCompartidosConmigo()
      .then((data) => { if (activo) setTableros(data ?? []); })
      .catch(() => { if (activo) setTableros([]); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, []);

  return (
    <div className="min-h-dvh bg-primero text-cuarto font-roboto">
      <AppHeader logoUrl={branding?.logoUrl} nombreMarca={branding?.nombreMarca}>
        <div className="min-w-0 flex-1">
          <h1 className="text-[0.9em] sm:text-[1.05em] font-semibold font-poppins text-cuarto tracking-tight truncate">
            Tableros de equipo
          </h1>
          <p className="text-[0.75em] text-cuarto/60 mt-[0.1em] hidden sm:block">
            Tableros personales que tus compañeros compartieron contigo
          </p>
        </div>
      </AppHeader>

      <main className="px-[1em] sm:px-[1.5em] xl:px-[2em] py-[1em] sm:py-[1.5em]">
        {loading ? (
          <EquiposSkeleton />
        ) : tableros.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[6em] gap-[1em]">
            <div className="w-[4em] h-[4em] rounded-[1em] bg-cuarto/5 border border-cuarto/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-cuarto/30 text-[1.5em]" />
            </div>
            <div className="text-center">
              <p className="text-[0.9em] font-medium text-cuarto/70 font-poppins">Aún no tienes tableros de equipo</p>
              <p className="text-[0.8em] text-cuarto/40 mt-[0.25em]">Aquí aparecerán los tableros que tus compañeros compartan contigo</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[0.85em] sm:gap-[1em]">
            {tableros.map((t) => (
              <TableroEquipoCard key={t.ownerId} tablero={t} onEntrar={() => navigate(`/equipos/${t.ownerId}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function TableroEquipoCard({ tablero, onEntrar }) {
  return (
    <div
      onClick={onEntrar}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onEntrar(); }}
      className="flex h-full overflow-hidden rounded-[0.85em] bg-primero-claro border border-cuarto/10 hover:border-segundo/40 hover:shadow-lg hover:shadow-primero-oscuro/40 active:scale-[0.99] cursor-pointer transition-all duration-200 group"
    >
      <div className="w-[0.25em] flex-shrink-0 bg-segundo" />
      <div className="flex-1 flex flex-col px-[1em] sm:px-[1.25em] py-[1em] sm:py-[1.25em] min-w-0">
        <div className="flex items-center gap-[0.6em] mb-[0.85em] min-w-0">
          <div className="w-[2.5em] h-[2.5em] rounded-full bg-segundo/15 border border-segundo/30 flex items-center justify-center flex-shrink-0">
            <span className="text-segundo font-bold font-poppins text-[0.9em]">
              {(tablero.nombre ?? '?').trim().charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-[1.05em] font-bold font-poppins text-cuarto leading-tight truncate">
              Tablero de {tablero.nombre}
            </h3>
            <p className="text-[0.75em] text-cuarto/40 font-roboto truncate">{tablero.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-[0.4em] mb-[1em]">
          <div className="flex items-center gap-[0.5em] text-[0.8em] text-cuarto/70 font-roboto">
            <FontAwesomeIcon icon={faCubes} className="text-segundo/60 text-[0.85em] w-[1.1em]" />
            <span>{tablero.totalModulos ?? 0} módulo{(tablero.totalModulos ?? 0) === 1 ? '' : 's'}</span>
          </div>
          <div className="flex items-center gap-[0.5em] text-[0.8em] text-cuarto/70 font-roboto">
            <FontAwesomeIcon icon={faPenToSquare} className="text-segundo/60 text-[0.85em] w-[1.1em]" />
            <span>Ítems creados por ti: <span className="font-semibold text-segundo">{tablero.itemsCreadosPorMi ?? 0}</span></span>
          </div>
        </div>

        <div className="mt-auto pt-[0.75em] border-t border-cuarto/10">
          <span className="text-[0.8em] font-semibold font-poppins text-segundo group-hover:underline">
            Entrar al tablero →
          </span>
        </div>
      </div>
    </div>
  );
}

export default Equipos;
