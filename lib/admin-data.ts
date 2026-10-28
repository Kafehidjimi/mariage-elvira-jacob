import "server-only";

import { getRsvpRepository } from "@/lib/rsvp/repository";
import { buildSummary } from "@/lib/rsvp/summary";

export async function loadAdminSummary() {
  const repository = getRsvpRepository();
  const [responses, guests] = await Promise.all([repository.listResponses(), repository.listGuests()]);
  return buildSummary(responses, guests, repository.kind);
}
