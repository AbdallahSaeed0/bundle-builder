import { useState, useCallback } from 'react';

const STORAGE_KEY = 'bundleBuilder.savedSystem.v1';

export function readSavedSystem() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Could not read saved system from localStorage', err);
    return null;
  }
}

export function useSavedSystem() {
  const [lastSavedAt, setLastSavedAt] = useState(() => {
    const saved = readSavedSystem();
    return saved?.savedAt ?? null;
  });

  const save = useCallback((selections, openStepId) => {
    const payload = {
      selections,
      openStepId,
      savedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setLastSavedAt(payload.savedAt);
      return true;
    } catch (err) {
      console.warn('Could not save system to localStorage', err);
      return false;
    }
  }, []);

  return { save, lastSavedAt };
}
