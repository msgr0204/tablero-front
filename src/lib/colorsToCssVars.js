import hexToRgbString from './hexToRgbString';
import { COLOR_KEYS } from './applyBrandingColors';

function colorsToCssVars(colors = {}) {
  const style = {};
  COLOR_KEYS.forEach((key) => {
    const rgb = hexToRgbString(colors[key]);
    if (rgb) style[`--color-${key}`] = rgb;
  });
  return style;
}

export default colorsToCssVars;
