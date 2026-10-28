"use client";

import { ArrowDownUp, Download, LogOut, MessageCircle, Phone, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Monogram } from "@/components/ui/Monogram";
import { wedding } from "@/data/wedding";
import { TIME_ZONE } from "@/lib/date";
import type { EventId, RsvpStatus } from "@/lib/rsvp/schema";
import type { AdminRow, AdminSummary } from "@/lib/rsvp/summary";

type Props = {
  initial: AdminSummary | null;
  initialError: string | null;
  email: string;
  signOutAction: () => Promise<void>;
};

type SortKey = "date" | "lastName" | "guests" | "status";

const STATUSES: RsvpStatus[] = ["Confirmé", "En attente", "Absent"];

const eventLabel = (id: EventId) => wedding.rsvp.eventChoices.find((choice) => choice.id === id)?.label ?? id;

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("fr-FR", { timeZone: TIME_ZONE, dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
}

function toCsv(rows: AdminRow[]) {
  const header = ["Prénom", "Nom", "Téléphone", "Email", "Événement(s)", "Nombre", "Statut", "Date", "Message"];
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const lines = rows.map((row) =>
    [row.firstName, row.lastName, row.phone, row.email, row.events.map(eventLabel).join(" + "), row.guests, row.status, formatDate(row.date), row.message]
      .map(escape)
      .join(";"),
  );
  // BOM pour qu'Excel lise correctement les accents.
  return "﻿" + [header.map(escape).join(";"), ...lines].join("\r\n");
}

function Stat({ label, value, detail }: { label: string; value: number | null; detail?: string }) {
  return (
    <div className="border border-navy/15 bg-white px-4 py-5">
      <p className="label text-[0.6875rem]">{label}</p>
      <p className="mt-2 font-serif text-[2.5rem] font-medium leading-none lining-nums tabular-nums">{value ?? "—"}</p>
      {detail ? <p className="mt-2 text-small text-navy/80">{detail}</p> : null}
    </div>
  );
}

const statusStyle: Record<RsvpStatus, string> = {
  Confirmé: "bg-navy text-ivory",
  "En attente": "border border-navy/40 text-navy",
  Absent: "bg-navy/10 text-navy",
};

export function RSVPAdmin({ initial, initialError, email, signOutAction }: Props) {
  const [summary, setSummary] = useState<AdminSummary | null>(initial);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | RsvpStatus>("");
  const [eventFilter, setEventFilter] = useState<"" | EventId>("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "date", dir: -1 });

  async function refresh() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/rsvp", { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      setSummary((await response.json()) as AdminSummary);
      setError(null);
    } catch {
      setError("Actualisation impossible. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  const rows = useMemo(() => {
    if (!summary) return [];
    const q = query.trim().toLowerCase();
    return summary.rows
      .filter((row) => !status || row.status === status)
      .filter((row) => !eventFilter || row.events.includes(eventFilter))
      .filter((row) => !q || [row.firstName, row.lastName, row.phone, row.email, row.message].join(" ").toLowerCase().includes(q))
      .sort((a, b) => {
        const av = a[sort.key] ?? "";
        const bv = b[sort.key] ?? "";
        return (typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), "fr")) * sort.dir;
      });
  }, [summary, query, status, eventFilter, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((current) => ({ key, dir: current.key === key ? (current.dir === 1 ? -1 : 1) : key === "date" ? -1 : 1 }));

  function exportCsv() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rsvp-elvira-jacob-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const sortButton = (label: string, k: SortKey) => (
    <button type="button" onClick={() => toggleSort(k)} className="label inline-flex min-h-11 items-center gap-1 text-[0.6875rem]">
      {label}
      <ArrowDownUp className="size-3" aria-hidden />
      <span className="sr-only">{sort.key === k ? (sort.dir === 1 ? "(croissant)" : "(décroissant)") : "(trier)"}</span>
    </button>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 text-navy sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-navy/15 pb-6">
        <div className="flex items-center gap-4">
          <Monogram className="size-14" />
          <div>
            <h1 className="font-script text-[2.5rem] leading-none">Réponses RSVP</h1>
            <p className="text-small text-navy/80">
              {email} · source : {summary?.source === "google-sheets" ? "Google Sheets" : "fichier local"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={refresh} disabled={loading} className="label inline-flex min-h-11 items-center gap-2 border border-navy px-4 disabled:opacity-60">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
            Actualiser
          </button>
          <button type="button" onClick={exportCsv} disabled={!rows.length} className="label inline-flex min-h-11 items-center gap-2 bg-navy px-4 text-ivory disabled:opacity-60">
            <Download className="size-4" aria-hidden />
            Export CSV
          </button>
          <form action={signOutAction}>
            <button type="submit" className="label inline-flex min-h-11 items-center gap-2 px-3" aria-label="Se déconnecter">
              <LogOut className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </header>

      {error ? (
        <p role="alert" className="mt-6 border-l-2 border-red-800 bg-red-50 px-4 py-3 text-small text-red-900">
          {error}
        </p>
      ) : null}

      {summary ? (
        <>
          <section aria-label="Indicateurs" className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat label="Total invités" value={summary.totalGuests} detail={summary.totalGuests === null ? "Liste « Invités » vide" : undefined} />
            <Stat label="Confirmés" value={summary.confirmed} />
            <Stat label="En attente" value={summary.pending} />
            <Stat label="Absents" value={summary.absent} />
            <Stat label="Personnes attendues" value={summary.expectedPeople} />
          </section>
          <section aria-label="Par événement" className="mt-3 grid gap-3 sm:grid-cols-2">
            {wedding.rsvp.eventChoices.map((choice) => (
              <div key={choice.id} className="flex items-baseline justify-between border border-navy/15 bg-white px-4 py-4">
                <p className="label text-[0.6875rem]">{choice.label}</p>
                <p className="text-small">
                  <span className="font-serif text-h3 font-medium lining-nums tabular-nums">{summary.byEvent[choice.id].people}</span> personnes ·{" "}
                  {summary.byEvent[choice.id].responses} réponses
                </p>
              </div>
            ))}
          </section>

          <section aria-label="Filtres" className="mt-8 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <span className="sr-only">Rechercher</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un nom, un numéro…"
                className="min-h-11 w-full border border-navy/25 bg-white py-2 pl-9 pr-3 placeholder:text-navy/60"
              />
            </label>
            <label>
              <span className="sr-only">Filtrer par statut</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as "" | RsvpStatus)} className="min-h-11 w-full border border-navy/25 bg-white px-3">
                <option value="">Tous les statuts</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Filtrer par événement</span>
              <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value as "" | EventId)} className="min-h-11 w-full border border-navy/25 bg-white px-3">
                <option value="">Tous les événements</option>
                {wedding.rsvp.eventChoices.map((choice) => (
                  <option key={choice.id} value={choice.id}>
                    {choice.label}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <p className="mt-4 text-small text-navy/80" aria-live="polite">
            {rows.length} ligne{rows.length > 1 ? "s" : ""}
          </p>

          {/* Tableau sur grand écran */}
          <div className="mt-3 hidden overflow-x-auto border border-navy/15 bg-white lg:block">
            <table className="w-full text-left text-small">
              <thead className="border-b border-navy/15">
                <tr>
                  <th className="px-3"><span className="label text-[0.6875rem]">Prénom</span></th>
                  <th className="px-3">{sortButton("Nom", "lastName")}</th>
                  <th className="px-3"><span className="label text-[0.6875rem]">Téléphone</span></th>
                  <th className="px-3"><span className="label text-[0.6875rem]">Email</span></th>
                  <th className="px-3"><span className="label text-[0.6875rem]">Événement(s)</span></th>
                  <th className="px-3">{sortButton("Nombre", "guests")}</th>
                  <th className="px-3">{sortButton("Statut", "status")}</th>
                  <th className="px-3">{sortButton("Date", "date")}</th>
                  <th className="px-3"><span className="label text-[0.6875rem]">Message</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-navy/10 align-top last:border-0">
                    <td className="px-3 py-3">{row.firstName}</td>
                    <td className="px-3 py-3">{row.lastName}</td>
                    <td className="whitespace-nowrap px-3 py-3"><PhoneLinks phone={row.phone} /></td>
                    <td className="px-3 py-3">{row.email || "—"}</td>
                    <td className="px-3 py-3">{row.events.map(eventLabel).join(", ") || "—"}</td>
                    <td className="px-3 py-3 lining-nums tabular-nums">{row.guests}</td>
                    <td className="px-3 py-3"><StatusBadge status={row.status} /></td>
                    <td className="whitespace-nowrap px-3 py-3">{formatDate(row.date)}</td>
                    <td className="max-w-xs px-3 py-3">{row.message || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fiches empilées sur mobile */}
          <ul className="mt-3 grid gap-3 lg:hidden">
            {rows.map((row) => (
              <li key={row.key} className="border border-navy/15 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-serif text-h3 font-medium">
                    {row.firstName} {row.lastName}
                  </p>
                  <StatusBadge status={row.status} />
                </div>
                <div className="mt-2"><PhoneLinks phone={row.phone} /></div>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small">
                  {row.email ? (<><dt className="text-navy/80">Email</dt><dd className="break-all">{row.email}</dd></>) : null}
                  <dt className="text-navy/80">Événements</dt>
                  <dd>{row.events.map(eventLabel).join(", ") || "—"}</dd>
                  <dt className="text-navy/80">Personnes</dt>
                  <dd>{row.guests}</dd>
                  <dt className="text-navy/80">Date</dt>
                  <dd>{formatDate(row.date)}</dd>
                </dl>
                {row.message ? <p className="mt-3 border-l-2 border-beige-ornament pl-3 text-small italic">{row.message}</p> : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}

function StatusBadge({ status }: { status: RsvpStatus }) {
  return <span className={`label inline-block whitespace-nowrap px-2 py-1 text-[0.625rem] ${statusStyle[status]}`}>{status}</span>;
}

function PhoneLinks({ phone }: { phone: string }) {
  if (!phone) return <span>—</span>;
  return (
    <span className="inline-flex items-center gap-1">
      <a href={`tel:${phone}`} className="inline-flex min-h-11 items-center gap-1 underline-offset-4 hover:underline">
        <Phone className="size-3.5" aria-hidden />
        {phone}
      </a>
      <a
        href={`https://wa.me/${phone.replace("+", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex size-11 items-center justify-center"
        aria-label={`WhatsApp ${phone}`}
      >
        <MessageCircle className="size-4" aria-hidden />
      </a>
    </span>
  );
}
