import { getEvent, wedding } from "@/data/wedding";
import { buildIcs } from "@/lib/calendar";

export function generateStaticParams() {
  return wedding.events.map((event) => ({ event: event.id }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ event: string }> }) {
  const { event: id } = await params;
  const event = getEvent(id);
  if (!event) return new Response("Événement inconnu", { status: 404 });

  return new Response(buildIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="mariage-${event.id}.ics"`,
    },
  });
}
