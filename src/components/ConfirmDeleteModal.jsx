import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import ModalActions from './ModalActions';

// Confirmación de borrado. La pastilla del encabezado va en rojo y no en el cian
// del resto de diálogos: es la señal de que esto no se deshace, y darle el mismo
// color que a "crear" invitaría a confirmarlo por inercia.
function ConfirmDeleteModal({ isOpen, label, onCancel, onConfirm, confirming }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Eliminar"
      size="sm"
      footer={
        <ModalActions
          type="button"
          onCancel={onCancel}
          onConfirm={onConfirm}
          confirmLabel="Eliminar"
          confirmIcon={faTrash}
          loading={confirming}
          peligro
        />
      }
    >
      <div className="flex gap-[0.85em]">
        <span className="w-[2.5em] h-[2.5em] rounded-[0.75em] bg-quinto/15 border border-quinto/30 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-quinto-claro text-[0.9em]" />
        </span>
        <p className="text-[0.875em] text-cuarto/70 font-roboto leading-relaxed">
          ¿Seguro que quieres eliminar {label}? Esta acción no se puede deshacer desde la app.
        </p>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
