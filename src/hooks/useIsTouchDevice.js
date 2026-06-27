import { useState, useEffect } from 'react';

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const check = () => setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    check();
    const mq = window.matchMedia('(pointer: coarse)');
    mq.addEventListener('change', check);
    return () => mq.removeEventListener('change', check);
  }, []);

  return isTouch;
}

export default useIsTouchDevice;
