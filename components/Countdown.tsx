"use client";

import { CalendarPlus } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { wedding } from "@/data/wedding";
import { googleCalendarUrl } from "@/lib/calendar";
import { formatLongDate, remainingUntil } from "@/lib/date";

// Horloge partagée, à la seconde. Côté serveur : null, d'où aucun écart d'hydratation.
function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 1000);
  return () => window.clearInterval(id);
}
const getSnapshot = () => Math.floor(Date.now() / 1000) * 1000;
const getServerSnapshot = () => null;

/** Durée pendant laquelle un événement en cours garde le message « C'est aujourd'hui ». */
const LIVE_WINDOW_MS = 10 * 60 * 60 * 1000;

const UNITS = [
  { key: "days", label: "Jours" },
  { key: "hours", label: "Heures" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Secondes" },
] as const;

export function Countdown() {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const events = wedding.events;

  // Cible : le prochain événement à venir.
  const upcoming = now === null ? events[0] : events.find((event) => new Date(event.start).getTime() > now);
  const live =
    now !== null &&
    events.find((event) => {
      const start = new Date(event.start).getTime();
      return now >= start && now < start + LIVE_WINDOW_MS;
    });
  const finished = now !== null && !upcoming && !live;
  const remaining = upcoming && now !== null ? remainingUntil(upcoming.start, now) : null;

  return (
    <section aria-labelledby="compte-title" className="paper px-5 py-28 sm:px-8 sm:py-36">
      <SectionTitle id="compte-title" title={wedding.texts.countdownTitle} />

      <Reveal className="mx-auto mt-14 flex max-w-4xl flex-col items-center text-center">
        {live && !remaining ? (
          <p className="font-script text-h2">{wedding.texts.countdownLive}</p>
        ) : finished ? (
          <p className="font-script text-h2">{wedding.texts.countdownAfter}</p>
        ) : upcoming ? (
          <>
            <p className="label">
              Avant {upcoming.shortTitle} · {formatLongDate(upcoming.start)}
            </p>
            <div
              className="mt-10 grid w-full grid-cols-4 border-y border-beige-ornament/70"
              role="timer"
              aria-live="off"
              aria-label={
                remaining
                  ? `${remaining.days} jours, ${remaining.hours} heures et ${remaining.minutes} minutes avant ${upcoming.shortTitle}`
                  : `Compte à rebours avant ${upcoming.shortTitle}`
              }
            >
              {UNITS.map((unit, index) => (
                <div
                  key={unit.key}
                  className={`flex flex-col items-center gap-2 py-6 sm:py-10 ${index > 0 ? "border-l border-beige-ornament/70" : ""}`}
                >
                  <span className="font-serif text-[clamp(2.25rem,1.4rem+4vw,5.5rem)] font-medium leading-none lining-nums tabular-nums">
                    {remaining ? String(remaining[unit.key]).padStart(2, "0") : "--"}
                  </span>
                  <span className="label text-[0.625rem] !tracking-[0.06em] sm:text-label sm:!tracking-[0.2em]">{unit.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <div className="mt-12 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col items-center gap-1 border border-navy/15 px-5 py-4 sm:min-w-64">
              <p className="label">{event.title}</p>
              <div className="flex flex-wrap items-center justify-center gap-x-4">
                <a href={`/api/calendar/${event.id}`} className="inline-flex min-h-11 items-center gap-2 text-small underline-offset-4 hover:underline">
                  <CalendarPlus className="size-4" aria-hidden />
                  Agenda (.ics)
                </a>
                <a
                  href={googleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-small underline-offset-4 hover:underline"
                >
                  Google Agenda
                </a>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
