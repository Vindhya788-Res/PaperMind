import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a byte count into a human-readable size string. */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(decimals)} ${units[exponent]}`;
}

/** Format a large number with compact notation (e.g. 12.4k). */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

/** Format an ISO date string as a short, locale-aware date. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Return a relative time string such as "3 days ago". */
export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  let duration = diffMs / 1000;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(-Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return "just now";
}
