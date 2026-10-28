// Toutes les dates sont affichées à l'heure d'Abidjan (UTC+0, sans heure d'été).
export const TIME_ZONE = "Africa/Abidjan";
const LOCALE = "fr-FR";

function format(iso: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, ...options }).format(new Date(iso));
}

/** « jeudi 5 novembre 2026 » */
export function formatLongDate(iso: string) {
  return format(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/** « 5 novembre » */
export function formatDayMonth(iso: string) {
  return format(iso, { day: "numeric", month: "long" });
}

/** Morceaux pour la grande date de la carte : « 05 », « NOV. », « 2026 ». */
export function dateParts(iso: string) {
  const day = format(iso, { day: "2-digit" });
  const month = format(iso, { month: "short" }).replace(/\.$/, "").toUpperCase() + ".";
  const year = format(iso, { year: "numeric" });
  const weekday = format(iso, { weekday: "long" });
  return { day, month, year, weekday };
}

export type Remaining = { days: number; hours: number; minutes: number; seconds: number };

export function remainingUntil(targetIso: string, nowMs: number): Remaining | null {
  const diff = new Date(targetIso).getTime() - nowMs;
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** Format compact des agendas (.ics, Google Calendar) : 20261105T110000Z */
export function toCalendarStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
