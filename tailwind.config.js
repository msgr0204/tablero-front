/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}' // Incluye estos patrones para tus archivos
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        typewriter: "typewriter 4s steps(24) infinite, blink 0.7s step-end infinite",
      },
      keyframes: {
        typewriter: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "currentColor" },
        },
      },
      fontFamily: {
        roboto: ["roboto", "sans-serif"],
        poppins: ["poppins", "sans-serif"],
        gotham: ['gotham', 'sans-serif'], // Agrega una familia de reserva
      },
      colors: {  //(Modificar) cambiar los colores de la aplicacion
        // Estos colores leen de variables CSS (definidas en index.css) para
        // poder ser sobrescritos en runtime por tenant (branding dinámico).
        primero: {
          DEFAULT: 'rgb(var(--color-primero) / <alpha-value>)',
          claro: 'rgb(var(--color-primero-claro) / <alpha-value>)',
          fuerte: 'rgb(var(--color-primero-fuerte) / <alpha-value>)',
          oscuro: 'rgb(var(--color-primero-oscuro) / <alpha-value>)',
        },
        segundo: {
          DEFAULT: 'rgb(var(--color-segundo) / <alpha-value>)',
          claro: 'rgb(var(--color-segundo-claro) / <alpha-value>)',
          oscuro: 'rgb(var(--color-segundo-oscuro) / <alpha-value>)',
          claricimo:'#d5f9fb',
          traslucido: 'rgba(87, 240, 254, 0.4)',
        },
        tercero: {
          DEFAULT: 'rgb(var(--color-tercero) / <alpha-value>)',
          claro: 'rgb(var(--color-tercero-claro) / <alpha-value>)',
          oscuro: 'rgb(var(--color-tercero-oscuro) / <alpha-value>)',
        },
        cuarto: {
          DEFAULT: 'rgb(var(--color-cuarto) / <alpha-value>)',
          claro: 'rgb(var(--color-cuarto-claro) / <alpha-value>)',
          oscuro: 'rgb(var(--color-cuarto-oscuro) / <alpha-value>)',
        },
        quinto: {
          DEFAULT: 'rgb(var(--color-quinto) / <alpha-value>)',
          claro: 'rgb(var(--color-quinto-claro) / <alpha-value>)',
          oscuro: 'rgb(var(--color-quinto-oscuro) / <alpha-value>)',
          traslucido: 'rgba(179, 62, 63, 0.4)',
        },
        sexto: {
          DEFAULT: '#00A6F4',
        },
        septimo: {
          DEFAULT: '#4ADE80',
        },
        octavo: {
          DEFAULT: '#ffe100',
          oscuro: '#c88a04',
          traslucido: 'rgba(255, 225, 0, 0.4)',
        },
      },
    }
  },
  plugins: []
}
