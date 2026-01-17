import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  try {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return date; // Return original if invalid
    }
    return format(parsed, "MMMM d, yyyy");
  } catch {
    return date; // Fallback to original on error
  }
}
