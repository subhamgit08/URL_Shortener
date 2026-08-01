import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This function merges your Tailwind classes dynamically without style conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
