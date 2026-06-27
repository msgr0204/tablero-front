import Modal from './Modal';
import Button from './Button';

function ConfirmDeleteModal({ isOpen, label, onCancel, onConfirm, confirming }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Eliminar" size="sm">
      <p className="text-[0.875em] text-cuarto/70 font-roboto mb-[1.25em]">
        ¿Seguro que quieres eliminar {label}? Esta acción no se puede deshacer desde la app.
      </p>
      <div className="flex flex-col-reverse sm:flex-row gap-[0.75em]">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={confirming}>
          Cancelar
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} loading={confirming}>
          Eliminar
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
