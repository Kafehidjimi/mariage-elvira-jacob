import { RSVPForm } from "@/components/RSVPForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { wedding } from "@/data/wedding";
import { formatLongDate } from "@/lib/date";

export function RSVPSection() {
  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="on-navy navy-texture px-4 py-28 text-ivory sm:px-8 sm:py-36">
      <SectionTitle id="rsvp-title" eyebrow="RSVP" title={wedding.texts.rsvpTitle} tone="navy" />
      <Reveal className="mx-auto mt-6 max-w-xl text-center">
        <p className="text-body text-ivory/90">
          {wedding.texts.rsvpIntro} {formatLongDate(wedding.rsvp.deadline)}.
        </p>
      </Reveal>
      <Reveal className="mx-auto mt-12 max-w-3xl">
        <RSVPForm />
      </Reveal>
    </section>
  );
}
