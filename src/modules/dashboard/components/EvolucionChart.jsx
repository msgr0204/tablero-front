import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function formatSemana(iso) {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
}

function EvolucionChart({ datos }) {
  const chartData = datos.map((d) => ({ ...d, semanaLabel: formatSemana(d.semana) }));

  return (
    <div className="bg-primero-claro border border-cuarto/10 rounded-[1em] p-[1.25em] flex flex-col gap-[1em]">
      <h3 className="text-[0.85em] font-semibold text-cuarto font-poppins uppercase tracking-wider">Evolución semanal</h3>
      {chartData.length === 0 ? (
        <div className="h-[16em] flex items-center justify-center">
          <p className="text-[0.85em] text-cuarto/25 italic font-roboto">Aún no hay suficiente actividad registrada</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="semanaLabel" tick={{ fontSize: 11, fill: 'rgb(var(--color-cuarto) / 0.5)' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'rgb(var(--color-cuarto) / 0.5)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgb(var(--color-primero-fuerte))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5em', fontSize: '0.8em' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.75em' }} />
            <Area type="monotone" dataKey="creados" name="Creados" stroke="rgb(var(--color-tercero))" fill="rgb(var(--color-tercero) / 0.15)" strokeWidth={2} />
            <Area type="monotone" dataKey="completados" name="Completados" stroke="rgb(var(--color-segundo))" fill="rgb(var(--color-segundo) / 0.15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default EvolucionChart;
