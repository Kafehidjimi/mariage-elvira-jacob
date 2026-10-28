import type { EventId, GuestRecord, RsvpRecord, RsvpStatus } from "@/lib/rsvp/schema";

export type AdminRow = {
  key: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  events: EventId[];
  guests: number;
  status: RsvpStatus;
  date: string | null;
  message: string;
};

export type AdminSummary = {
  totalGuests: number | null;
  confirmed: number;
  pending: number | null;
  absent: number;
  expectedPeople: number;
  byEvent: Record<EventId, { responses: number; people: number }>;
  rows: AdminRow[];
  source: "google-sheets" | "local";
};

/**
 * Rapprochement réponses / liste des invités sur le téléphone normalisé.
 * En cas de doublon, la réponse la plus récente fait foi.
 */
export function buildSummary(responses: RsvpRecord[], guests: GuestRecord[], source: AdminSummary["source"]): AdminSummary {
  const latest = new Map<string, RsvpRecord>();
  for (const response of responses) {
    const key = response.phone || `${response.firstName} ${response.lastName}`.toLowerCase();
    const current = latest.get(key);
    if (!current || response.timestamp >= current.timestamp) latest.set(key, response);
  }

  const rows: AdminRow[] = [...latest.entries()].map(([key, r]) => ({
    key,
    firstName: r.firstName,
    lastName: r.lastName,
    phone: r.phone,
    email: r.email,
    events: r.events,
    guests: r.guests,
    status: r.attending === "yes" ? "Confirmé" : "Absent",
    date: r.timestamp,
    message: r.message,
  }));

  for (const guest of guests) {
    if (guest.phone && latest.has(guest.phone)) continue;
    rows.push({
      key: `guest-${guest.phone || `${guest.firstName}-${guest.lastName}`}`,
      firstName: guest.firstName,
      lastName: guest.lastName,
      phone: guest.phone,
      email: "",
      events: [],
      guests: 0,
      status: "En attente",
      date: null,
      message: "",
    });
  }

  const confirmed = rows.filter((row) => row.status === "Confirmé");
  const byEvent: AdminSummary["byEvent"] = { civil: { responses: 0, people: 0 }, religieux: { responses: 0, people: 0 } };
  for (const row of confirmed) {
    for (const event of row.events) {
      byEvent[event].responses += 1;
      byEvent[event].people += row.guests;
    }
  }

  const hasGuestList = guests.length > 0;
  return {
    totalGuests: hasGuestList ? guests.length : null,
    confirmed: confirmed.length,
    pending: hasGuestList ? rows.filter((row) => row.status === "En attente").length : null,
    absent: rows.filter((row) => row.status === "Absent").length,
    expectedPeople: confirmed.reduce((sum, row) => sum + row.guests, 0),
    byEvent,
    rows: rows.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
    source,
  };
}
