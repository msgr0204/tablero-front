import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import EmptyState from '../../../components/EmptyState';

function DistribucionChart({ titulo, datos }) {
  const conDatos = datos.filter((d) => d.total > 0);

  return (
    <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] p-[1.25em] flex flex-col gap-[1em]">
      <h3 className="text-[0.85em] font-semibold text-cuarto font-poppins uppercase tracking-wider">{titulo}</h3>
      {conDatos.length === 0 ? (
        <EmptyState
          icon={faChartPie}
          titulo="Sin datos para mostrar"
          descripcion={`Cuando tus requerimientos tengan ${titulo.toLowerCase()}, verás aquí su distribución.`}
          altura="14em"
        />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={conDatos} dataKey="total" nameKey="label" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
              {conDatos.map((d, i) => (
                <Cell key={i} fill={d.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'rgb(var(--color-primero-fuerte))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5em', fontSize: '0.8em' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.75em' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default DistribucionChart;
