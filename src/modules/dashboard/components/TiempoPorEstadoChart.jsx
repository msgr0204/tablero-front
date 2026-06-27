import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

function TiempoPorEstadoChart({ datos }) {
  const conDatos = datos.filter((d) => d.diasPromedio !== null);

  return (
    <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] p-[1.25em] flex flex-col gap-[1em]">
      <h3 className="text-[0.85em] font-semibold text-cuarto font-poppins uppercase tracking-wider">Tiempo promedio por estado</h3>
      {conDatos.length === 0 ? (
        <div className="h-[16em] flex items-center justify-center">
          <p className="text-[0.85em] text-cuarto/25 italic font-roboto">Aún no hay suficiente actividad registrada</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={conDatos}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'rgb(var(--color-cuarto) / 0.6)' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'rgb(var(--color-cuarto) / 0.5)' }} unit="d" />
            <Tooltip
              formatter={(value) => [`${value} días`, 'Tiempo promedio']}
              contentStyle={{ backgroundColor: 'rgb(var(--color-primero-fuerte))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5em', fontSize: '0.8em' }}
            />
            <Bar dataKey="diasPromedio" radius={[4, 4, 0, 0]}>
              {conDatos.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default TiempoPorEstadoChart;
