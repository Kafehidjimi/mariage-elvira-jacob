import { NextResponse } from "next/server";

import { auth, isAdminEmail } from "@/lib/auth";

// Protège l'espace administrateur et son API : seul un email de la liste blanche passe.
export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/connexion")) return NextResponse.next();

  if (isAdminEmail(request.auth?.user?.email)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 401 });
  }
  const url = new URL("/admin/connexion", request.nextUrl.origin);
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
