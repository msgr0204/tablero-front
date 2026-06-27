import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CategoryCardPreview from './previews/CategoryCardPreview';
import ModuleCardPreview from './previews/ModuleCardPreview';
import StatusBadgesPreview from './previews/StatusBadgesPreview';

const SLIDES = [
  { titulo: 'Tus categorías', Preview: CategoryCardPreview },
  { titulo: 'Organiza por módulos', Preview: ModuleCardPreview },
  { titulo: 'Estados y prioridades a tu medida', Preview: StatusBadgesPreview },
];

const SLIDE_DURATION = 4500;

function AuthCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const { titulo, Preview } = SLIDES[activeSlide];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative hidden md:flex flex-col w-[22em] flex-shrink-0 rounded-[1.5em] overflow-hidden m-[0.75em] mr-0"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-primero-fuerte via-[#0c2336] to-segundo-oscuro/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-screen"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #57f0fe 0%, transparent 45%), radial-gradient(circle at 80% 75%, #38bdf8 0%, transparent 40%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '2.5em 2.5em',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-between p-[1.75em] pb-0">
        <span className="font-poppins font-bold text-[1.15em] tracking-tight text-cuarto">
          Tare<span className="text-sm">Q</span><span className="text-segundo">.</span>
        </span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-[1.75em] py-[1.5em] gap-[1.1em] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-[0.85em]"
          >
            <h2 className="font-poppins font-bold text-[1.05em] leading-[1.2] text-cuarto/90">
              {titulo}
            </h2>
            <Preview />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex items-center gap-[0.4em] p-[1.75em] pt-0">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className="p-[0.25em] -m-[0.25em] focus:outline-none"
          >
            <span
              className={[
                'block h-[0.3em] rounded-full transition-all duration-300',
                i === activeSlide ? 'w-[1.4em] bg-segundo' : 'w-[0.3em] bg-cuarto/20 hover:bg-cuarto/40',
              ].join(' ')}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default AuthCarousel;
