import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

function useDragSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    })
  );
}

export default useDragSensors;
