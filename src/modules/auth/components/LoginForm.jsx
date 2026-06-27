import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

function LoginForm({ onSubmit, loading = false, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[1.4em]">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fieldVariants} className="flex flex-col gap-[0.35em]">
        <h1 className="font-poppins font-bold text-[1.7em] text-cuarto tracking-tight">
          Bienvenido de vuelta
        </h1>
        <p className="text-[0.85em] text-cuarto/45">
          ¿No tienes cuenta?{' '}
          <Link to="/auth/register" className="text-segundo hover:text-segundo-claro underline underline-offset-2 transition-colors">
            Regístrate
          </Link>
        </p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={1} variants={fieldVariants}>
        <Input
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          type="email"
          placeholder="Correo electrónico"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={2} variants={fieldVariants}>
        <Input
          icon={<FontAwesomeIcon icon={faLock} />}
          type={showPassword ? 'text' : 'password'}
          placeholder="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="text-cuarto/35 hover:text-cuarto/60 transition-colors text-[0.85em] focus:outline-none"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          }
        />
      </motion.div>

      {error && (
        <p role="alert" className="text-[0.8em] text-quinto-claro text-center bg-quinto/10 border border-quinto/20 rounded-[0.5em] py-[0.5em] px-[0.75em]">
          {error}
        </p>
      )}

      <motion.div initial="hidden" animate="visible" custom={3} variants={fieldVariants}>
        <Button type="submit" loading={loading}>
          Iniciar sesión
        </Button>
      </motion.div>
    </form>
  );
}

export default LoginForm;
