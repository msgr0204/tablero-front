export default function normalizeDate(value) {
  if (!value) return null;
  return String(value).slice(0, 10);
}
