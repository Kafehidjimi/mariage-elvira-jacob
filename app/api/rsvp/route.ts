import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";
import { getRsvpRepository } from "@/lib/rsvp/repository";
import { isRsvpOpen, rsvpSchema, toRecord } from "@/lib/rsvp/schema";

export async function POST(request: Request) {
  if (!isRsvpOpen()) {
    return NextResponse.json({ error: "Les réponses en ligne sont closes." }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "inconnu";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Honeypot rempli : on répond comme si tout allait bien, sans rien enregistrer.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ error: "Certains champs sont à corriger.", fieldErrors }, { status: 422 });
  }

  try {
    await getRsvpRepository().addResponse(toRecord(parsed.data));
  } catch (error) {
    console.error("[rsvp] enregistrement impossible", error);
    return NextResponse.json({ error: "Enregistrement impossible pour le moment. Réessayez dans un instant." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
