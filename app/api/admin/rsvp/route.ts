import { NextResponse } from "next/server";

import { loadAdminSummary } from "@/lib/admin-data";
import { auth, isAdminEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  // Double vérification, en plus du proxy.
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 401 });
  }
  try {
    return NextResponse.json(await loadAdminSummary(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[admin] lecture impossible", error);
    return NextResponse.json({ error: "Lecture des réponses impossible." }, { status: 502 });
  }
}
