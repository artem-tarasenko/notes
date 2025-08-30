import { fakeFetch } from "./fakeFetch";
import type { INote } from "../types";

interface IApiClient {
  saveNotes: (notes: INote[]) => Promise<void>;
}

interface IApiClientConfig {
  baseUrl?: string;
  timeout?: number;
}

//no reason to have a factory here, just as one way to do it
export function createApiClient(config: IApiClientConfig = {}): IApiClient {
  const { baseUrl = "https://api.example.com", timeout = 10000 } = config;

  async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fakeFetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // This funciton ideally show thorw an error, not supress it. In case of this archicture, I would opt for toasts to get a user feedback.
  // So, the error show be above where it can be used to set a message for a toast.
  // additionally, this is a good candidate to use caching and retries
  // Next is validation, this function is asking for a ZOD validation with a proper schema
  async function saveNotes(notes: INote[]): Promise<void> {
    const response = await fetchWithTimeout(
      `${baseUrl}/notes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      },
      timeout
    );

    const result = await response.json();
    console.log("✅ API: Notes saved successfully", result);
  }

  return {
    saveNotes,
  };
}

export const apiClient = createApiClient();
