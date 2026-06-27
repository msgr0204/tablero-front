import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBuilding, faEnvelope, faUserShield } from '@fortawesome/free-solid-svg-icons';
import AppHeader from '../../../components/AppHeader';
import { useAuth } from '../../../context/AuthContext';
import { useBranding } from '../../../context/BrandingContext';

const ROL_LABEL = { admin: 'Administrador', miembro: 'Miembro' };

function obtenerIniciales(nombre) {
  if (!nombre) return 'US';
  const partes = nombre.trim().split(/\s+/);
  const iniciales = partes.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return iniciales.join('') || 'US';
}

function Perfil() {
  const navigate = useNavigate();
  const { usuario, tenant } = useAuth();
  const { branding } = useBranding();

  return (
    <div className="min-h-dvh bg-primero">
      <AppHeader logoUrl={branding?.logoUrl} nombreMarca={branding?.nombreMarca}>
        <button
          type="button"
          onClick={() => navigate('/tablero')}
          className="flex items-center gap-[0.5em] text-cuarto/60 hover:text-cuarto text-[0.85em] font-roboto transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver al tablero
        </button>
      </AppHeader>

      <main className="max-w-[36em] mx-auto p-[1.25em] sm:p-[2em]">
        <div className="flex flex-col items-center text-center p-[2em] rounded-[1em] bg-primero-fuerte border border-cuarto/10">
          <div className="w-[4.5em] h-[4.5em] rounded-full bg-segundo/20 border-2 border-segundo/40 flex items-center justify-center mb-[1em]">
            <span className="text-[1.5em] font-bold font-poppins text-segundo">{obtenerIniciales(usuario?.nombre)}</span>
          </div>

          <h1 className="text-[1.3em] font-bold font-poppins text-cuarto">{usuario?.nombre}</h1>

          <div className="flex flex-col gap-[0.6em] mt-[1.25em] w-full text-left">
            <DatoFila icon={faEnvelope} label="Correo" valor={usuario?.email} />
            <DatoFila icon={faBuilding} label="Empresa" valor={tenant?.nombre} />
            <DatoFila icon={faUserShield} label="Rol" valor={ROL_LABEL[usuario?.rol] ?? usuario?.rol} />
          </div>
        </div>
      </main>
    </div>
  );
}

function DatoFila({ icon, label, valor }) {
  if (!valor) return null;
  return (
    <div className="flex items-center gap-[0.75em] px-[1em] py-[0.75em] rounded-[0.6em] bg-primero/40 border border-cuarto/5">
      <FontAwesomeIcon icon={icon} className="text-segundo/70 w-[1em]" />
      <div className="min-w-0">
        <p className="text-[0.65em] text-cuarto/40 font-roboto uppercase tracking-wider">{label}</p>
        <p className="text-[0.85em] text-cuarto font-roboto truncate">{valor}</p>
      </div>
    </div>
  );
}

export default Perfil;
