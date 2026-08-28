import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faBriefcase, faAddressBook, faTriangleExclamation, faCheck } from '@fortawesome/free-solid-svg-icons';
import Select from '../../../components/Select';

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'miembro', label: 'Miembro' },
];

const ESTADOS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
];

// Un solo estilo de input para todo el formulario: el error solo cambia el
// borde, para no remaquetar el campo cuando aparece el mensaje debajo.
const inputClass = (hasError) => [
  'w-full h-[2.75em] px-[0.85em] rounded-[0.6em] text-[0.9em] font-roboto outline-none transition-all duration-150',
  'bg-primero-claro/60 text-cuarto placeholder:text-cuarto/30 border',
  hasError
    ? 'border-quinto/60 focus:border-quinto focus:ring-1 focus:ring-quinto/30'
    : 'border-cuarto/10 hover:border-cuarto/20 focus:border-segundo/60 focus:bg-primero-claro focus:ring-1 focus:ring-segundo/40',
].join(' ');

// Campo con etiqueta, hint y error, la unidad que se repite en toda la rejilla.
function Campo({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-[0.35em]">
      <label className="text-[0.7em] font-semibold text-cuarto/50 font-poppins uppercase tracking-wider">
        {label}
        {required && <span className="text-quinto ml-[0.25em]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[0.7em] text-cuarto/35 font-roboto">{hint}</p>}
      {error && <p className="text-[0.7em] text-quinto-claro font-roboto">{error}</p>}
    </div>
  );
}

// Encabezado de sección con el filete degradado que separa los bloques del
// formulario largo sin meter una línea dura entre cada grupo.
function Seccion({ icon, titulo, children }) {
  return (
    <div className="flex flex-col gap-[0.85em]">
      <div className="flex items-center gap-[0.6em]">
        <FontAwesomeIcon icon={icon} className="text-[0.8em] text-segundo/70" />
        <span className="text-[0.7em] font-bold uppercase tracking-[0.12em] text-cuarto/50 font-poppins">{titulo}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-cuarto/15 to-transparent" />
      </div>
      {children}
    </div>
  );
}

function UsuarioForm({ onSubmit, onCancel, initialValues }) {
  const isEdit = Boolean(initialValues);
  const [form, setForm] = useState({
    nombre: initialValues?.nombre ?? '',
    email: initialValues?.email ?? '',
    password: '',
    confirmPassword: '',
    rol: initialValues?.rol ?? 'admin',
    estado: initialValues?.activo === false ? 'inactivo' : 'activo',
    cargo: initialValues?.cargo ?? '',
    telefono: initialValues?.telefono ?? '',
    documento: initialValues?.documento ?? '',
    ubicacion: initialValues?.ubicacion ?? '',
  });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const marcar = (campo) => () => setTouched((t) => ({ ...t, [campo]: true }));

  // La contraseña es obligatoria al crear; al editar solo se valida si el admin
  // escribió una nueva (dejarla vacía significa "no cambiarla").
  const errors = {};
  if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
  if (!isEdit && !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Correo inválido';
  if (!isEdit || form.password) {
    if (form.password.length < 6) errors.password = 'Mínimo 6 caracteres';
    else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  if (form.documento && !/^\d{4,15}$/.test(form.documento)) errors.documento = 'Entre 4 y 15 dígitos';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length) {
      setTouched({ nombre: true, email: true, password: true, confirmPassword: true, documento: true });
      setError('Corrige los campos marcados.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const perfil = {
        rol: form.rol,
        activo: form.estado === 'activo',
        cargo: form.cargo.trim(),
        telefono: form.telefono.trim(),
        documento: form.documento.trim(),
        ubicacion: form.ubicacion.trim(),
      };
      const payload = isEdit
        ? { nombre: form.nombre.trim(), ...perfil, ...(form.password ? { password: form.password } : {}) }
        : { nombre: form.nombre.trim(), email: form.email.trim(), password: form.password, ...perfil };
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[1.5em]">

      <Seccion icon={faIdCard} titulo="Datos de acceso">
        <div className="grid gap-[0.85em] sm:grid-cols-2">
          <Campo label="Nombre completo" required error={touched.nombre && errors.nombre}>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => set('nombre')(e.target.value)}
              onBlur={marcar('nombre')}
              placeholder="Ej. Ana Gómez"
              className={inputClass(touched.nombre && errors.nombre)}
            />
          </Campo>

          <Campo label="Correo electrónico" required error={touched.email && errors.email} hint={isEdit ? 'El correo no se puede cambiar' : undefined}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email')(e.target.value)}
              onBlur={marcar('email')}
              placeholder="ejemplo@correo.com"
              disabled={isEdit}
              className={`${inputClass(touched.email && errors.email)} ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </Campo>

          <Campo label={isEdit ? 'Nueva contraseña' : 'Contraseña'} required={!isEdit} error={touched.password && errors.password} hint={isEdit ? 'Déjala vacía para no cambiarla' : 'Mínimo 6 caracteres'}>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set('password')(e.target.value)}
              onBlur={marcar('password')}
              placeholder="••••••"
              className={inputClass(touched.password && errors.password)}
            />
          </Campo>

          <Campo label="Confirmar contraseña" required={!isEdit} error={touched.confirmPassword && errors.confirmPassword}>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => set('confirmPassword')(e.target.value)}
              onBlur={marcar('confirmPassword')}
              placeholder="••••••"
              className={inputClass(touched.confirmPassword && errors.confirmPassword)}
            />
          </Campo>
        </div>
      </Seccion>

      <Seccion icon={faBriefcase} titulo="Rol y estado">
        <div className="grid gap-[0.85em] sm:grid-cols-2">
          <Campo label="Rol" hint="Define qué puede hacer">
            <Select value={form.rol} onChange={set('rol')} options={ROLES} />
          </Campo>
          <Campo label="Estado" hint="Una cuenta inactiva no puede iniciar sesión">
            <Select value={form.estado} onChange={set('estado')} options={ESTADOS} />
          </Campo>
        </div>
      </Seccion>

      <Seccion icon={faAddressBook} titulo="Información de contacto">
        <div className="grid gap-[0.85em] sm:grid-cols-2">
          <Campo label="Cargo">
            <input type="text" value={form.cargo} onChange={(e) => set('cargo')(e.target.value)} placeholder="Ej. Desarrollador" className={inputClass(false)} />
          </Campo>
          <Campo label="Teléfono">
            <input type="tel" value={form.telefono} onChange={(e) => set('telefono')(e.target.value)} placeholder="3001234567" className={inputClass(false)} />
          </Campo>
          <Campo label="Documento" error={touched.documento && errors.documento}>
            <input type="text" value={form.documento} onChange={(e) => set('documento')(e.target.value)} onBlur={marcar('documento')} placeholder="Cédula / NIT" className={inputClass(touched.documento && errors.documento)} />
          </Campo>
          <Campo label="Ubicación">
            <input type="text" value={form.ubicacion} onChange={(e) => set('ubicacion')(e.target.value)} placeholder="Ciudad" className={inputClass(false)} />
          </Campo>
        </div>
      </Seccion>

      {error && (
        <p role="alert" className="flex items-start gap-[0.6em] text-[0.8em] text-quinto-claro bg-quinto/10 border border-quinto/20 rounded-[0.6em] py-[0.6em] px-[0.85em]">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mt-[0.15em] flex-shrink-0" />
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-[0.75em] pt-[0.25em] border-t border-cuarto/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-[1.25em] h-[2.75em] rounded-[0.6em] text-[0.85em] font-semibold font-poppins text-cuarto/60 hover:text-cuarto transition-colors duration-150"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-[0.5em] px-[1.5em] h-[2.75em] rounded-[0.6em] text-[0.85em] font-bold font-poppins bg-segundo text-primero-oscuro hover:bg-segundo-claro active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/60"
        >
          {loading
            ? <div className="w-[0.9em] h-[0.9em] border-2 border-primero-oscuro/40 border-t-primero-oscuro rounded-full animate-spin" />
            : <FontAwesomeIcon icon={faCheck} />}
          {isEdit ? 'Guardar cambios' : 'Crear usuario'}
        </button>
      </div>
    </form>
  );
}

export default UsuarioForm;
