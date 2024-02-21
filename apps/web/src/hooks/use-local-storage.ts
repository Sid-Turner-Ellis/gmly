import { useState, useEffect, Dispatch, SetStateAction } from "react";

type StoredValue<T> = T | null;

export const useLocalStorage = <T>(
  key: string,
  initialValue: T | null
): [StoredValue<T>, Dispatch<SetStateAction<StoredValue<T>>>] => {
  const [storedValue, setStoredValue] = useState<StoredValue<T>>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
