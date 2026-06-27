import hexToRgbString from './hexToRgbString';

const COLOR_KEYS = [
  'primero', 'primero-claro', 'primero-fuerte', 'primero-oscuro',
  'segundo', 'segundo-claro', 'segundo-oscuro',
  'tercero', 'tercero-claro', 'tercero-oscuro',
  'cuarto', 'cuarto-claro', 'cuarto-oscuro',
  'quinto', 'quinto-claro', 'quinto-oscuro',
];

/**
 * Determina si el fondo principal del tema es claro u oscuro a partir de
 * su luminosidad relativa, para que los controles nativos del navegador
 * (ej. el icono del calendario en <input type="date">) se rendericen con
 * contraste correcto sin depender del modo claro/oscuro del sistema operativo.
 */
function esFondoClaro(rgb) {
  const [r, g, b] = rgb.split(' ').map(Number);
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminancia > 0.6;
}

function applyBrandingColors(colors = {}) {
  const root = document.documentElement;
  COLOR_KEYS.forEach((key) => {
    const rgb = hexToRgbString(colors[key]);
    if (rgb) root.style.setProperty(`--color-${key}`, rgb);
  });

  const primeroRgb = hexToRgbString(colors.primero);
  if (primeroRgb) {
    root.style.colorScheme = esFondoClaro(primeroRgb) ? 'light' : 'dark';
  }
}

/**
 * Quita las variables de branding aplicadas inline, devolviendo la app a
 * la paleta fija de Quantum definida en :root (index.css). Se usa al cerrar
 * sesión: el login/registro es la vitrina pública de Quantum y no debe
 * heredar los colores del último tenant autenticado.
 */
function resetBrandingColors() {
  const root = document.documentElement;
  COLOR_KEYS.forEach((key) => root.style.removeProperty(`--color-${key}`));
  root.style.removeProperty('color-scheme');
}

export { COLOR_KEYS, resetBrandingColors };
export default applyBrandingColors;
