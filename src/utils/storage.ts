import type { Plan } from "../types";

const STORAGE_KEYS = {
  PLANS: "plans",
} as const;

const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

const setToStorage = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key "${key}":`, error);
  }
};

export const plansStorage = {
  get: (): Plan[] => getFromStorage(STORAGE_KEYS.PLANS, []),
  set: (plans: Plan[]): void => setToStorage(STORAGE_KEYS.PLANS, plans),
  clear: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.PLANS);
    }
  },
};
