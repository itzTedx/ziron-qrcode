import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(slug: string) {
  return slug
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove duplicate hyphens
}

export const formatWebsiteUrl = (
  website: string | null | undefined
): string => {
  if (!website) return "";
  try {
    return new URL(website.startsWith("http") ? website : `https://${website}`)
      .href;
  } catch {
    return "";
  }
};
