// Simple shared utility to manage a "show sensitive data" flag across the app.
const STORAGE_KEY = 'showSensitiveData_v1';

type Subscriber = (value: boolean) => void;

export function getShowSensitive(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return true; // default: show data
    return raw === '1' || raw === 'true';
  } catch {
    return true;
  }
}

export function setShowSensitive(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // ignore
  }
  // Dispatch a global event so components can listen and update
  try {
    const ev = new CustomEvent('sensitive-change', { detail: { value } });
    window.dispatchEvent(ev as Event);
  } catch {
    // ignore
  }
}

export function subscribeSensitive(cb: Subscriber) {
  const handler = (e: Event) => {
    try {
      // CustomEvent with detail
      // @ts-ignore
      const v = (e as CustomEvent).detail?.value;
      if (typeof v === 'boolean') cb(v);
      else cb(getShowSensitive());
    } catch {
      cb(getShowSensitive());
    }
  };

  window.addEventListener('sensitive-change', handler as EventListener);

  // Return unsubscribe
  return () => window.removeEventListener('sensitive-change', handler as EventListener);
}

export default { getShowSensitive, setShowSensitive, subscribeSensitive };
