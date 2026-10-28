import { Monogram } from "@/components/ui/Monogram";
import { signIn } from "@/lib/auth";

export default async function LoginPage({ searchParams }: PageProps<"/admin/connexion">) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const callbackUrl = typeof params.callbackUrl === "string" && params.callbackUrl.startsWith("/admin") ? params.callbackUrl : "/admin/rsvp";

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-5 text-center">
      <Monogram className="size-20 text-navy" />
      <h1 className="font-script text-h2">Espace des mariés</h1>
      {error ? (
        <p role="alert" className="max-w-sm text-small text-red-800">
          Accès refusé. Connectez-vous avec une adresse Google autorisée.
        </p>
      ) : null}
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: callbackUrl });
        }}
      >
        <button type="submit" className="label min-h-11 bg-navy px-6 py-3 text-ivory hover:bg-navy-deep">
          Se connecter avec Google
        </button>
      </form>
    </main>
  );
}
