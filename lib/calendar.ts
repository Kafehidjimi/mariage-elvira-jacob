import { wedding, type WeddingEvent } from "@/data/wedding";
import { toCalendarStamp } from "@/lib/date";

function coupleTitle() {
  return `${wedding.bride.firstName} & ${wedding.groom.firstName}`;
}

function location(event: WeddingEvent) {
  return [event.venue, event.address, event.city].filter((part, i, all) => all.indexOf(part) === i).join(", ");
}

function details(event: WeddingEvent) {
  const lines = [event.description];
  if (event.id === wedding.meal.afterEventId) lines.push(wedding.meal.text);
  if (event.mapsUrl) lines.push(`Itinéraire : ${event.mapsUrl}`);
  return lines.join("\n");
}

export function googleCalendarUrl(event: WeddingEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — ${coupleTitle()}`,
    dates: `${toCalendarStamp(event.start)}/${toCalendarStamp(event.end)}`,
    details: details(event),
    location: location(event),
    ctz: "Africa/Abidjan",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;");
}

export function buildIcs(event: WeddingEvent) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Elvira & Jacob//Mariage//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}-${toCalendarStamp(event.start)}@elvira-jacob`,
    `DTSTAMP:${toCalendarStamp(new Date().toISOString())}`,
    `DTSTART:${toCalendarStamp(event.start)}`,
    `DTEND:${toCalendarStamp(event.end)}`,
    `SUMMARY:${escapeIcs(`${event.title} — ${coupleTitle()}`)}`,
    `LOCATION:${escapeIcs(location(event))}`,
    `DESCRIPTION:${escapeIcs(details(event))}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(event.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}
