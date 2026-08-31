import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes cleanly with clsx and twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date into clean human-readable string
 */
export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncate long strings with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}
