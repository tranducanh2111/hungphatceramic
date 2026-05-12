import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Uses clsx for conditional classes, then twMerge to deduplicate Tailwind utilities.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-champagne", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}