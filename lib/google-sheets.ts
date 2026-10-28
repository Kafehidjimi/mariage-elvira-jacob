import "server-only";

import { google, type sheets_v4 } from "googleapis";

import { wedding } from "@/data/wedding";
import { EVENT_IDS, normalizePhone, type EventId, type GuestRecord, type RsvpRecord, type RsvpStatus } from "@/lib/rsvp/schema";
import type { RsvpRepository } from "@/lib/rsvp/repository";

export const RESPONSES_TAB = "Réponses";
export const GUESTS_TAB = "Invités";

const RESPONSE_HEADERS = [
  "Horodatage",
  "Prénom",
  "Nom",
  "Téléphone",
  "Email",
  "Présence",
  "Événements",
  "Nombre",
  "Message",
  "Statut",
];
const GUEST_HEADERS = ["Prénom", "Nom", "Téléphone"];

export function googleSheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID,
  );
}

function eventLabel(id: EventId) {
  return wedding.rsvp.eventChoices.find((choice) => choice.id === id)?.label ?? id;
}

function parseEvents(cell: string): EventId[] {
  return EVENT_IDS.filter((id) => cell.includes(eventLabel(id)));
}

export class GoogleSheetsRepository implements RsvpRepository {
  readonly kind = "google-sheets" as const;
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;
  private ready: Promise<void> | null = null;

  constructor() {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Vercel stocke les retours à la ligne de la clé sous la forme « \n ».
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    this.sheets = google.sheets({ version: "v4", auth });
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID as string;
  }

  /** Crée les onglets et les en-têtes s'ils n'existent pas encore. */
  private ensureTabs() {
    this.ready ??= (async () => {
      const { data } = await this.sheets.spreadsheets.get({ spreadsheetId: this.spreadsheetId, fields: "sheets.properties.title" });
      const titles = new Set(data.sheets?.map((sheet) => sheet.properties?.title));
      const missing = [RESPONSES_TAB, GUESTS_TAB].filter((title) => !titles.has(title));
      if (missing.length > 0) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: { requests: missing.map((title) => ({ addSheet: { properties: { title } } })) },
        });
      }
      for (const [tab, headers] of [
        [RESPONSES_TAB, RESPONSE_HEADERS],
        [GUESTS_TAB, GUEST_HEADERS],
      ] as const) {
        const head = await this.sheets.spreadsheets.values.get({ spreadsheetId: this.spreadsheetId, range: `'${tab}'!A1:J1` });
        if (!head.data.values?.length) {
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: `'${tab}'!A1`,
            valueInputOption: "RAW",
            requestBody: { values: [headers] },
          });
        }
      }
    })().catch((error) => {
      this.ready = null;
      throw error;
    });
    return this.ready;
  }

  async addResponse(record: RsvpRecord) {
    await this.ensureTabs();
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `'${RESPONSES_TAB}'!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            record.timestamp,
            record.firstName,
            record.lastName,
            record.phone,
            record.email,
            record.attending === "yes" ? "Présent(e)" : "Absent(e)",
            record.events.map(eventLabel).join(", "),
            record.guests,
            record.message,
            record.status,
          ],
        ],
      },
    });
  }

  async listResponses(): Promise<RsvpRecord[]> {
    await this.ensureTabs();
    const { data } = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `'${RESPONSES_TAB}'!A2:J`,
    });
    return (data.values ?? [])
      .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
      .map((row) => {
        const [timestamp, firstName, lastName, phone, email, presence, events, guests, message, status] = row.map((cell) =>
          String(cell ?? ""),
        );
        const attending = presence.toLowerCase().startsWith("pr") ? "yes" : "no";
        return {
          timestamp,
          firstName,
          lastName,
          phone: normalizePhone(phone) ?? phone,
          email,
          attending,
          events: parseEvents(events),
          guests: Number(guests) || 0,
          message,
          status: (status as RsvpStatus) || (attending === "yes" ? "Confirmé" : "Absent"),
        } satisfies RsvpRecord;
      });
  }

  async listGuests(): Promise<GuestRecord[]> {
    await this.ensureTabs();
    const { data } = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `'${GUESTS_TAB}'!A2:C`,
    });
    return (data.values ?? [])
      .map((row) => {
        const [firstName = "", lastName = "", phone = ""] = row.map((cell) => String(cell ?? "").trim());
        return { firstName, lastName, phone: normalizePhone(phone) ?? phone };
      })
      .filter((guest) => guest.firstName || guest.lastName || guest.phone);
  }
}
