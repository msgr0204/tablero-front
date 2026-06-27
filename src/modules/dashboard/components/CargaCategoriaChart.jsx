import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function CargaCategoriaChart({ datos }) {
  const chartData = datos.map((d) => ({ nombre: d.nombre, pendientes: d.total - d.completados, completados: d.completados }));

  return (
    <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] p-[1.25em] flex flex-col gap-[1em]">
      <h3 className="text-[0.85em] font-semibold text-cuarto font-poppins uppercase tracking-wider">Carga por categoría</h3>
      {chartData.length === 0 ? (
        <div className="h-[16em] flex items-center justify-center">
          <p className="text-[0.85em] text-cuarto/25 italic font-roboto">Sin categorías aún</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 48)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: 'rgb(var(--color-cuarto) / 0.5)' }} allowDecimals={false} />
            <YAxis type="category" dataKey="nombre" width={110} tick={{ fontSize: 11, fill: 'rgb(var(--color-cuarto) / 0.7)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgb(var(--color-primero-fuerte))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5em', fontSize: '0.8em' }}
            />
            <Bar dataKey="completados" stackId="a" fill="rgb(var(--color-segundo))" radius={[0, 0, 0, 0]} />
            <Bar dataKey="pendientes" stackId="a" fill="rgb(var(--color-cuarto) / 0.2)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default CargaCategoriaChart;
