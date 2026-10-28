import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/** Liste blanche des administrateurs, séparés par des virgules. */
export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  return Boolean(email && adminEmails().includes(email.toLowerCase()));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  pages: { signIn: "/admin/connexion", error: "/admin/connexion" },
  callbacks: {
    signIn({ user, profile }) {
      // Refuse toute adresse hors liste blanche, ou non vérifiée par Google.
      const verified = (profile as { email_verified?: boolean } | undefined)?.email_verified !== false;
      return verified && isAdminEmail(user.email);
    },
  },
});
