import { z } from "zod";

import { wedding } from "@/data/wedding";

export const EVENT_IDS = ["civil", "religieux"] as const;
export type EventId = (typeof EVENT_IDS)[number];

/**
 * Normalise un numéro : format ivoirien par défaut (+225 puis 10 chiffres),
 * numéros internationaux acceptés s'ils commencent par + ou 00.
 * Renvoie null si le numéro n'est pas valide.
 */
export function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s.\-()]/g, "");
  let digits: string;
  if (cleaned.startsWith("+")) digits = cleaned.slice(1);
  else if (cleaned.startsWith("00")) digits = cleaned.slice(2);
  else if (/^\d{10}$/.test(cleaned)) digits = `225${cleaned}`;
  else digits = cleaned;

  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith("225")) return digits.length === 13 ? `+${digits}` : null;
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
}

const trimmed = (max: number) => z.string().trim().max(max, `${max} caractères au maximum.`);

export const rsvpSchema = z
  .object({
    firstName: trimmed(60).min(1, "Merci d'indiquer votre prénom."),
    lastName: trimmed(60).min(1, "Merci d'indiquer votre nom."),
    phone: z
      .string()
      .trim()
      .min(1, "Merci d'indiquer votre numéro de téléphone.")
      .refine((value) => normalizePhone(value) !== null, "Numéro invalide : +225 suivi de 10 chiffres (ou numéro international)."),
    email: z.union([z.literal(""), z.email("Adresse email invalide.").max(120)]).optional().default(""),
    attending: z.enum(["yes", "no"], { error: "Merci d'indiquer si vous serez présent(e)." }),
    events: z.array(z.enum(EVENT_IDS)).default([]),
    guests: z.coerce
      .number({ error: "Nombre de personnes invalide." })
      .int("Nombre de personnes invalide.")
      .min(0, "Nombre de personnes invalide.")
      .max(wedding.rsvp.maxGuests, `${wedding.rsvp.maxGuests} personnes au maximum par réponse.`)
      .default(0),
    message: trimmed(1000).optional().default(""),
    /** Honeypot : doit rester vide. */
    website: z.string().max(0).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.attending !== "yes") return;
    if (data.events.length === 0) {
      ctx.addIssue({ code: "custom", path: ["events"], message: "Choisissez au moins un événement." });
    }
    if (data.guests < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["guests"],
        message: `Indiquez le nombre de personnes (1 à ${wedding.rsvp.maxGuests}).`,
      });
    }
  });

export type RsvpInput = z.input<typeof rsvpSchema>;
export type RsvpData = z.output<typeof rsvpSchema>;

export type RsvpStatus = "Confirmé" | "Absent" | "En attente";

export type RsvpRecord = {
  timestamp: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  attending: "yes" | "no";
  events: EventId[];
  guests: number;
  message: string;
  status: RsvpStatus;
};

export type GuestRecord = {
  firstName: string;
  lastName: string;
  phone: string;
};

export function toRecord(data: RsvpData, now = new Date()): RsvpRecord {
  const attending = data.attending === "yes";
  return {
    timestamp: now.toISOString(),
    firstName: data.firstName,
    lastName: data.lastName,
    phone: normalizePhone(data.phone) ?? data.phone,
    email: data.email ?? "",
    attending: data.attending,
    events: attending ? data.events : [],
    guests: attending ? data.guests : 0,
    message: data.message ?? "",
    status: attending ? "Confirmé" : "Absent",
  };
}

export function isRsvpOpen(now = Date.now()) {
  const { deadline } = wedding.rsvp;
  return deadline === null || now <= new Date(deadline).getTime();
}
