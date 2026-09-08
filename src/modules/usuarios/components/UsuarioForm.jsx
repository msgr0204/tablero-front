import { useState } from 'react';
import { faIdCard, faBriefcase, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import Select from '../../../components/Select';
import { Campo, Seccion, CamposGrid, ErrorAviso, inputClass } from '../../../components/FormKit';

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'miembro', label: 'Miembro' },
];

const ESTADOS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
];

export const USUARIO_FORM_ID = 'form-usuario';

function UsuarioForm({ onSubmit, initialValues, onLoadingChange }) {
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
    onLoadingChange?.(true);
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
      onLoadingChange?.(false);
    }
  };

  return (
    <form id={USUARIO_FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-[1.5em]">

      <Seccion icon={faIdCard} titulo="Datos de acceso">
        <CamposGrid>
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
        </CamposGrid>
      </Seccion>

      <Seccion icon={faBriefcase} titulo="Rol y estado">
        <CamposGrid>
          <Campo label="Rol" hint="Define qué puede hacer">
            <Select value={form.rol} onChange={set('rol')} options={ROLES} />
          </Campo>
          <Campo label="Estado" hint="Una cuenta inactiva no puede iniciar sesión">
            <Select value={form.estado} onChange={set('estado')} options={ESTADOS} />
          </Campo>
        </CamposGrid>
      </Seccion>

      <Seccion icon={faAddressBook} titulo="Información de contacto">
        <CamposGrid>
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
        </CamposGrid>
      </Seccion>

      <ErrorAviso>{error}</ErrorAviso>

    </form>
  );
}

export default UsuarioForm;
