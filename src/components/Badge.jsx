const HEX_PATTERN = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function buildHexStyle(hex) {
  const { r, g, b } = hexToRgb(hex);
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
    color: `rgb(${r}, ${g}, ${b})`,
  };
}

function Badge({ config, size = 'md' }) {
  if (!config) return null;

  const sizeClass = size === 'sm' ? 'px-[0.5em] py-[0.15em] text-[0.7em]' : 'px-[0.6em] py-[0.2em] text-[0.75em]';
  const isHex = HEX_PATTERN.test(config.color ?? '');

  return (
    <span
      className={`inline-flex items-center rounded-[0.4em] border font-poppins font-medium whitespace-nowrap ${sizeClass} ${isHex ? '' : config.color}`}
      style={isHex ? buildHexStyle(config.color) : undefined}
    >
      {config.label}
    </span>
  );
}

export default Badge;
