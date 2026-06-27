import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Select from '../../../components/Select';

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'miembro', label: 'Miembro' },
];

function UsuarioForm({ onSubmit, onCancel, initialValues }) {
  const isEdit = Boolean(initialValues);
  const [nombre, setNombre] = useState(initialValues?.nombre ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(initialValues?.rol ?? 'admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return setError('El nombre es obligatorio.');
    if (!isEdit && !email.trim()) return setError('El correo es obligatorio.');
    if (!isEdit && password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    setError('');
    setLoading(true);
    try {
      const payload = isEdit
        ? { nombre: nombre.trim(), rol, ...(password ? { password } : {}) }
        : { nombre: nombre.trim(), email: email.trim(), password, rol };
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[1em]">
      <Input
        icon={<FontAwesomeIcon icon={faIdCard} />}
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      {!isEdit && (
        <Input
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      )}
      <Input
        icon={<FontAwesomeIcon icon={faLock} />}
        type="password"
        placeholder={isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña temporal'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex flex-col gap-[0.4em]">
        <label className="text-[0.8em] font-medium text-cuarto/70 font-poppins">Rol</label>
        <Select value={rol} onChange={setRol} options={ROLES} />
      </div>

      {error && (
        <p role="alert" className="text-[0.8em] text-quinto-claro text-center bg-quinto/10 border border-quinto/20 rounded-[0.5em] py-[0.5em] px-[0.75em]">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-[0.75em] pt-[0.25em]">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {isEdit ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  );
}

export default UsuarioForm;
