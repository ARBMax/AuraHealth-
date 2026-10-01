import { AmbulanceDispatch } from '../types/aura';

// Storage key version 2 - ensures any old dummy data in user's browser is completely cleared out
const STORAGE_KEY = 'aura_user_ambulance_dispatches_v2';

export const loadAmbulanceDispatches = (): AmbulanceDispatch[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load ambulance dispatches from localStorage', err);
  }
  // Zero dummy data by default
  return [];
};

export const saveAmbulanceDispatches = (dispatches: AmbulanceDispatch[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dispatches));
    window.dispatchEvent(new Event('aura_ambulance_sync'));
  } catch (err) {
    console.error('Failed to save ambulance dispatches', err);
  }
};
