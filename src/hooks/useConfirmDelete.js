import { useState } from 'react';

function useConfirmDelete(onRemove) {
  const [pendingId, setPendingId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const requestRemove = (id) => setPendingId(id);
  const cancelRemove = () => setPendingId(null);

  const confirmRemove = async () => {
    setConfirming(true);
    try {
      await onRemove(pendingId);
      setPendingId(null);
    } finally {
      setConfirming(false);
    }
  };

  return { pendingId, isOpen: pendingId !== null, confirming, requestRemove, cancelRemove, confirmRemove };
}

export default useConfirmDelete;
