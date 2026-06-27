import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faCircleCheck, faTriangleExclamation, faClock, faChartLine } from '@fortawesome/free-solid-svg-icons';

function ResumenCards({ resumen }) {
  const tarjetas = [
    { icon: faFolderOpen, label: 'Abiertos', value: resumen.abiertos, color: 'text-segundo' },
    { icon: faCircleCheck, label: 'Cerrados', value: resumen.cerrados, color: 'text-segundo' },
    { icon: faTriangleExclamation, label: 'Vencidos', value: resumen.vencidos, color: resumen.vencidos > 0 ? 'text-quinto-claro' : 'text-cuarto/60' },
    { icon: faClock, label: 'Tiempo prom. respuesta', value: resumen.tiempoPromedioRespuestaDias !== null ? `${resumen.tiempoPromedioRespuestaDias} d` : '—', color: 'text-cuarto/60' },
    { icon: faChartLine, label: 'Avance del proyecto', value: `${resumen.avancePorcentaje}%`, color: 'text-segundo' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[0.85em]">
      {tarjetas.map((t) => (
        <div key={t.label} className="bg-primero-claro border border-cuarto/10 rounded-[0.85em] p-[1em] flex flex-col gap-[0.5em]">
          <FontAwesomeIcon icon={t.icon} className={`text-[1em] ${t.color}`} />
          <span className="text-[1.4em] font-bold font-poppins text-cuarto leading-none">{t.value}</span>
          <span className="text-[0.75em] text-cuarto/40 font-roboto">{t.label}</span>
        </div>
      ))}
    </div>
  );
}

export default ResumenCards;
