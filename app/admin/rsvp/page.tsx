import { redirect } from "next/navigation";

import { RSVPAdmin } from "@/components/RSVPAdmin";
import { loadAdminSummary } from "@/lib/admin-data";
import { auth, isAdminEmail, signOut } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminRsvpPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) redirect("/admin/connexion");

  let summary = null;
  let error: string | null = null;
  try {
    summary = await loadAdminSummary();
  } catch (e) {
    console.error("[admin] lecture impossible", e);
    error = "Lecture des réponses impossible. Vérifiez la configuration Google Sheets.";
  }

  return (
    <RSVPAdmin
      initial={summary}
      initialError={error}
      email={session?.user?.email ?? ""}
      signOutAction={async () => {
        "use server";
        await signOut({ redirectTo: "/admin/connexion" });
      }}
    />
  );
}
