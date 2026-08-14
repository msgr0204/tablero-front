// Los campos de "solo fecha" (fecha_entrega) llegan como 'YYYY-MM-DD' ya
// normalizados; se les fija la hora local a mediodía para que toLocaleDateString
// no reste un día por la zona horaria. Los timestamps completos (created_at,
// fecha de observación) llegan con hora y se formatean tal cual.

export function formatearFecha(valor) {
  if (!valor) return '—';
  const iso = String(valor);
  const fecha = iso.length <= 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatearFechaHora(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
