import { CalendarPlus, MapPin } from "lucide-react";

import { LinkButton } from "@/components/ui/Button";
import { ChurchIcon } from "@/components/ui/ChurchIcon";
import { DinnerIcon } from "@/components/ui/DinnerIcon";
import { FrameDivider } from "@/components/ui/GeometricFrame";
import { Reveal } from "@/components/ui/Reveal";
import { RingsIcon } from "@/components/ui/RingsIcon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { wedding, type EventIcon, type WeddingEvent } from "@/data/wedding";
import { dateParts } from "@/lib/date";

function Icon({ icon, className }: { icon: EventIcon; className?: string }) {
  if (icon === "rings") return <RingsIcon className={className} />;
  if (icon === "church") return <ChurchIcon className={className} />;
  return <DinnerIcon className={className} />;
}

function EventRow({ event, reverse }: { event: WeddingEvent; reverse: boolean }) {
  const date = dateParts(event.start);
  return (
    <Reveal as="article" className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
      <div className={`flex flex-col items-center text-center ${reverse ? "md:items-start md:text-left" : "md:items-end md:text-right"}`}>
        <Icon icon={event.icon} className="h-16 w-auto text-beige" />
        <p className="mt-4 font-serif font-medium leading-[0.85] text-ivory">
          <span className="block text-[clamp(6rem,4rem+10vw,11rem)] lining-nums tabular-nums">{date.day}</span>
          <span className="mt-2 block text-h3 tracking-[0.2em] text-beige">
            {date.month} {date.year}
          </span>
        </p>
      </div>
      <div className={`flex flex-col items-center gap-4 text-center ${reverse ? "md:items-end md:text-right" : "md:items-start md:text-left"}`}>
        <p className="label text-beige">{date.weekday}</p>
        <h3 className="font-script text-h2 font-normal leading-none text-ivory">{event.title}</h3>
        <p className="text-h3">
          {event.venue}
          <span className="block text-body text-beige">
            {event.venueOnCard !== event.venue ? `${event.venueOnCard} · ` : ""}
            {event.city}
          </span>
        </p>
        <p className="label border border-beige/60 px-4 py-2 text-beige">{event.timeLabel}</p>
        <p className="max-w-sm text-body text-ivory/90">{event.description}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3 md:justify-start">
          {event.mapsUrl ? (
            <LinkButton href={event.mapsUrl} external variant="outline-light" aria-label={`Itinéraire vers ${event.venue}`}>
              <MapPin className="size-4" aria-hidden />
              Itinéraire
            </LinkButton>
          ) : null}
          <LinkButton href={`/api/calendar/${event.id}`} variant="ghost-light" aria-label={`Ajouter ${event.shortTitle} à mon agenda`}>
            <CalendarPlus className="size-4" aria-hidden />
            Agenda
          </LinkButton>
        </div>
      </div>
    </Reveal>
  );
}

export function EventDetails() {
  return (
    <section id="programme" aria-labelledby="programme-title" className="on-navy navy-texture px-5 py-28 text-ivory sm:px-8 sm:py-36">
      <SectionTitle id="programme-title" title={wedding.texts.programTitle} tone="navy" />
      <div className="mx-auto mt-20 flex max-w-5xl flex-col gap-24">
        {wedding.events.map((event, index) => (
          <EventRow key={event.id} event={event} reverse={index % 2 === 1} />
        ))}
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <FrameDivider className="h-4 w-40 text-beige" />
          <DinnerIcon className="h-20 w-auto text-beige" title="Repas" />
          <p className="max-w-md font-script text-[clamp(2rem,1.6rem+1.6vw,3rem)] leading-tight text-ivory">{wedding.meal.text}</p>
        </Reveal>
      </div>
    </section>
  );
}
