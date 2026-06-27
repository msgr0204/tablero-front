import { useState, useEffect } from 'react';

function useDraft(key, initial) {
  const storageKey = `draft_${key}`;

  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved !== null ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  const clear = () => {
    localStorage.removeItem(storageKey);
    setValue(initial);
  };

  return [value, setValue, clear];
}

export default useDraft;
