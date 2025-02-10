import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const URL = import.meta.env.VITE_API_URL;

export async function disAPI(url: string, method: string = "GET", body?: string) {
  try {
    const response = await fetch(`${URL}/${url}`, {
      method,
      body: body ? body : undefined,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Something went wrong: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error: ", error);
    throw error;
  }
}
