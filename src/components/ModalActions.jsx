import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Botonera de un modal. Antes ambos botones eran w-full y quedaban al 50/50: eso
// le da a "Cancelar" el mismo peso visual que a la acción que el usuario vino a
// hacer. Aquí la principal es sólida y Cancelar es texto discreto; en móvil se
// apilan con la principal arriba, que es donde cae el pulgar.
function ModalActions({
  onCancel,
  cancelLabel = 'Cancelar',
  confirmLabel,
  confirmIcon = faCheck,
  loading = false,
  disabled = false,
  peligro = false,
  type = 'submit',
  onConfirm,
  form,
}) {
  const principal = peligro
    ? 'bg-quinto text-cuarto-claro hover:bg-quinto/85'
    : 'bg-segundo text-primero-oscuro hover:bg-segundo-claro';

  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-[0.6em]">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-[1.25em] h-[2.75em] rounded-[0.6em] text-[0.85em] font-semibold font-poppins text-cuarto/60 hover:text-cuarto hover:bg-cuarto/5 transition-colors duration-150 disabled:opacity-50"
      >
        {cancelLabel}
      </button>
      <button
        type={type}
        form={form}
        onClick={onConfirm}
        disabled={loading || disabled}
        className={[
          'flex items-center justify-center gap-[0.5em] px-[1.5em] h-[2.75em] rounded-[0.6em]',
          'text-[0.85em] font-bold font-poppins transition-all duration-150',
          'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/60',
          principal,
        ].join(' ')}
      >
        {loading
          ? <span className="w-[0.9em] h-[0.9em] border-2 border-current/30 border-t-current rounded-full animate-spin" />
          : confirmIcon && <FontAwesomeIcon icon={confirmIcon} />}
        {confirmLabel}
      </button>
    </div>
  );
}

export default ModalActions;
