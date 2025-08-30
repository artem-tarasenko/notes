import { z } from "zod";
import { useEffect, useState } from "react";

export function useLocalStorage(key: string) {
  const [savedValue, setSavedValue] = useState<any>(null);

  function getValue<T>(schema: z.ZodSchema<T[]>): T[] {
    const item = window.localStorage.getItem(key);
    if (!item) return [];

    try {
      const parsed = JSON.parse(item);
      const result = schema.safeParse(parsed);
      return result.success ? result.data : [];
    } catch (error) {
      console.error("Error parsing localStorage item:", error);
      return [];
    }
  }

  function setValue<T>(value: T) {
    window.localStorage.setItem(key, JSON.stringify(value));
    setSavedValue(value);
  }

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        setSavedValue(JSON.parse(item));
      } catch (error) {
        console.error("Error parsing localStorage item:", error);
      }
    }
  }, [key]);

  return { setValue, getValue, savedValue };
}
