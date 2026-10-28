import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { googleSheetsConfigured, GoogleSheetsRepository } from "@/lib/google-sheets";
import type { GuestRecord, RsvpRecord } from "@/lib/rsvp/schema";

export interface RsvpRepository {
  readonly kind: "google-sheets" | "local";
  addResponse(record: RsvpRecord): Promise<void>;
  listResponses(): Promise<RsvpRecord[]>;
  listGuests(): Promise<GuestRecord[]>;
}

/**
 * Adaptateur local (sans Google) : fichiers JSON dans .data/, ignoré par Git.
 * Sur Vercel le disque n'est pas persistant : utiliser Google Sheets en production.
 */
class LocalJsonRepository implements RsvpRepository {
  readonly kind = "local" as const;
  private dir = process.env.VERCEL ? "/tmp/rsvp-data" : path.join(process.cwd(), ".data");

  private async read<T>(file: string): Promise<T[]> {
    try {
      return JSON.parse(await fs.readFile(path.join(this.dir, file), "utf8")) as T[];
    } catch {
      return [];
    }
  }

  async addResponse(record: RsvpRecord) {
    await fs.mkdir(this.dir, { recursive: true });
    const all = await this.read<RsvpRecord>("reponses.json");
    all.push(record);
    await fs.writeFile(path.join(this.dir, "reponses.json"), JSON.stringify(all, null, 2));
  }

  listResponses() {
    return this.read<RsvpRecord>("reponses.json");
  }

  listGuests() {
    return this.read<GuestRecord>("invites.json");
  }
}

let instance: RsvpRepository | null = null;

export function getRsvpRepository(): RsvpRepository {
  if (!instance) instance = googleSheetsConfigured() ? new GoogleSheetsRepository() : new LocalJsonRepository();
  return instance;
}
