import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faTrashArrowUp } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import ModalActions from './ModalActions';

// "Seguir editando" es la salida segura y por eso queda como acción discreta;
// descartar es lo destructivo y va marcado en rojo.
function ConfirmDiscardModal({ isOpen, onCancel, onDiscard }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Cambios sin guardar"
      size="sm"
      footer={
        <ModalActions
          type="button"
          onCancel={onCancel}
          cancelLabel="Seguir editando"
          onConfirm={onDiscard}
          confirmLabel="Descartar cambios"
          confirmIcon={faTrashArrowUp}
          peligro
        />
      }
    >
      <div className="flex gap-[0.85em]">
        <span className="w-[2.5em] h-[2.5em] rounded-[0.75em] bg-quinto/15 border border-quinto/30 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-quinto-claro text-[0.9em]" />
        </span>
        <p className="text-[0.875em] text-cuarto/70 font-roboto leading-relaxed">
          Tienes cambios sin guardar. ¿Quieres descartarlos?
        </p>
      </div>
    </Modal>
  );
}

export default ConfirmDiscardModal;
