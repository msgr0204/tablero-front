import Modal from './Modal';
import Button from './Button';

function ConfirmDiscardModal({ isOpen, onCancel, onDiscard }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Cambios sin guardar" size="sm">
      <p className="text-[0.875em] text-cuarto/70 font-roboto mb-[1.25em]">
        Tienes cambios sin guardar. ¿Quieres descartarlos?
      </p>
      <div className="flex flex-col-reverse sm:flex-row gap-[0.75em]">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Seguir editando
        </Button>
        <Button type="button" variant="danger" onClick={onDiscard}>
          Descartar cambios
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDiscardModal;
