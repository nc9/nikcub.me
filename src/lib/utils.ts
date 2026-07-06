import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Canonical site origin (no trailing slash). Build-time inlined from .env. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ??
  "https://nikcub.me"
).replace(/\/$/, "")

// Format in UTC so server (workerd, UTC) and client (visitor's timezone) always
// agree — avoids a hydration mismatch — and the authored calendar date is shown.
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "numeric",
})

export function formatDate(date: string): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return DATE_FMT.format(parsed)
}
