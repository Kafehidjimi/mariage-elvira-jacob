"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import { useId, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { RingsIcon } from "@/components/ui/RingsIcon";
import { wedding } from "@/data/wedding";
import { formatLongDate } from "@/lib/date";
import { EASE } from "@/lib/motion";
import { isRsvpOpen, rsvpSchema, type EventId } from "@/lib/rsvp/schema";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  attending: "" | "yes" | "no";
  events: EventId[];
  guests: string;
  message: string;
  website: string;
};

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  phone: "+225 ",
  email: "",
  attending: "",
  events: [],
  guests: "1",
  message: "",
  website: "",
};

type Errors = Partial<Record<keyof FormState | "form", string>>;

const noop = () => () => {};

const inputClass =
  "mt-2 block min-h-12 w-full border border-navy/25 bg-white px-4 py-3 font-serif text-body text-navy placeholder:text-navy/60 focus:border-navy focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy aria-[invalid=true]:border-red-700";

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label block">
        {label}
        {optional ? <span className="ml-2 normal-case tracking-normal text-navy/70">(facultatif)</span> : <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-small text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function RSVPForm() {
  const reduce = useReducedMotion();
  const uid = useId();
  const open = useSyncExternalStore(noop, () => isRsvpOpen(), () => true);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [sentName, setSentName] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  };

  const toggleEvent = (id: EventId) => {
    set("events", form.events.includes(id) ? form.events.filter((event) => event !== id) : [...form.events, id]);
  };

  const attending = form.attending === "yes";

  const payload = () => ({
    ...form,
    phone: form.phone.trim() === "+225" ? "" : form.phone,
    attending: form.attending || undefined,
    events: attending ? form.events : [],
    guests: attending ? form.guests : "0",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const parsed = rsvpSchema.safeParse(payload());
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form") as keyof Errors;
        next[key] ??= issue.message;
      }
      setErrors(next);
      const firstKey = Object.keys(next)[0];
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string; fieldErrors?: Errors };
      if (!response.ok) {
        setErrors({ ...(result.fieldErrors ?? {}), form: result.error ?? "Une erreur est survenue. Réessayez." });
        setStatus("idle");
        return;
      }
      setSentName(form.firstName.trim());
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      // Échec réseau : les données saisies restent dans le formulaire.
      setErrors({ form: "Connexion impossible. Vos réponses sont conservées : vérifiez votre réseau puis renvoyez." });
      setStatus("idle");
    }
  }

  if (!open) {
    return (
      <div className="flex flex-col items-center gap-6 bg-white px-6 py-12 text-center text-navy sm:px-12">
        <p className="text-body">{wedding.texts.rsvpClosed}</p>
        <ul className="flex flex-col gap-2">
          {wedding.contacts.map((contact) => (
            <li key={contact.e164}>
              <a href={`tel:${contact.e164}`} className="inline-flex min-h-11 items-center gap-2 text-h3 lining-nums tabular-nums">
                <Phone className="size-5" aria-hidden />
                {contact.display}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const describedBy = (key: keyof FormState) => (errors[key] ? `${uid}-${key}-error` : undefined);
  const idFor = (key: keyof FormState) => `${uid}-${key}`;

  return (
    <div className="relative bg-white px-5 py-10 text-navy sm:px-12 sm:py-14">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.3 : 0.8, ease: EASE }}
            className="flex flex-col items-center gap-6 py-10 text-center"
            role="status"
          >
            <RingsIcon className="w-24 text-beige-ornament" />
            <p className="font-script text-h2">Merci, {sentName}</p>
            <p className="max-w-md text-body">Votre réponse a bien été reçue. Nous avons hâte de partager ce moment avec vous.</p>
            <Button type="button" variant="outline" onClick={() => setStatus("idle")}>
              Envoyer une autre réponse
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-7 text-navy"
            aria-describedby={errors.form ? `${uid}-form-error` : undefined}
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <Field id={idFor("firstName")} label="Prénom" error={errors.firstName}>
                <input
                  id={idFor("firstName")}
                  name="given-name"
                  autoComplete="given-name"
                  className={inputClass}
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={describedBy("firstName")}
                  required
                />
              </Field>
              <Field id={idFor("lastName")} label="Nom" error={errors.lastName}>
                <input
                  id={idFor("lastName")}
                  name="family-name"
                  autoComplete="family-name"
                  className={inputClass}
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={describedBy("lastName")}
                  required
                />
              </Field>
            </div>

            <div className="grid gap-7 sm:grid-cols-2">
              <Field id={idFor("phone")} label="Téléphone" error={errors.phone}>
                <input
                  id={idFor("phone")}
                  type="tel"
                  name="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+225 07 00 00 00 00"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy("phone")}
                  required
                />
              </Field>
              <Field id={idFor("email")} label="Email" error={errors.email} optional>
                <input
                  id={idFor("email")}
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                />
              </Field>
            </div>

            <fieldset aria-describedby={describedBy("attending")}>
              <legend className="label">
                Présence<span aria-hidden="true"> *</span>
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2" id={idFor("attending")} tabIndex={-1}>
                {(
                  [
                    ["yes", "Je serai présent(e)"],
                    ["no", "Je ne pourrai pas venir"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex min-h-12 cursor-pointer items-center gap-3 border border-navy/25 px-4 py-3 has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy"
                  >
                    <input
                      type="radio"
                      name="attending"
                      value={value}
                      checked={form.attending === value}
                      onChange={() => set("attending", value)}
                      className="size-4 accent-navy"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              {errors.attending ? (
                <p id={`${uid}-attending-error`} className="mt-2 text-small text-red-800">
                  {errors.attending}
                </p>
              ) : null}
            </fieldset>

            <AnimatePresence initial={false}>
              {attending ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.45, ease: EASE }}
                  className="grid gap-7 overflow-hidden"
                >
                  <fieldset aria-describedby={describedBy("events")}>
                    <legend className="label">
                      Événement(s)<span aria-hidden="true"> *</span>
                    </legend>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2" id={idFor("events")} tabIndex={-1}>
                      {wedding.rsvp.eventChoices.map((choice) => (
                        <label
                          key={choice.id}
                          className="flex min-h-12 cursor-pointer items-center gap-3 border border-navy/25 px-4 py-3 has-[:checked]:border-navy has-[:checked]:bg-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy"
                        >
                          <input
                            type="checkbox"
                            name="events"
                            value={choice.id}
                            checked={form.events.includes(choice.id)}
                            onChange={() => toggleEvent(choice.id)}
                            className="size-4 accent-navy"
                          />
                          <span>{choice.label}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-small text-navy/80">Cochez les deux si vous venez aux deux célébrations.</p>
                    {errors.events ? (
                      <p id={`${uid}-events-error`} className="mt-2 text-small text-red-800">
                        {errors.events}
                      </p>
                    ) : null}
                  </fieldset>

                  <Field id={idFor("guests")} label="Nombre de personnes" error={errors.guests}>
                    <select
                      id={idFor("guests")}
                      className={`${inputClass} sm:max-w-xs`}
                      value={form.guests}
                      onChange={(e) => set("guests", e.target.value)}
                      aria-invalid={Boolean(errors.guests)}
                      aria-describedby={describedBy("guests")}
                    >
                      {Array.from({ length: wedding.rsvp.maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n > 1 ? "personnes" : "personne"}
                        </option>
                      ))}
                    </select>
                  </Field>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <Field id={idFor("message")} label="Message" error={errors.message} optional>
              <textarea
                id={idFor("message")}
                rows={4}
                className={`${inputClass} resize-y`}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message")}
              />
            </Field>

            {/* Honeypot anti-spam, invisible pour les humains */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={`${uid}-website`}>Ne pas remplir</label>
              <input
                id={`${uid}-website`}
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>

            {errors.form ? (
              <p id={`${uid}-form-error`} role="alert" className="border-l-2 border-red-800 bg-red-50 px-4 py-3 text-small text-red-900">
                {errors.form}
              </p>
            ) : null}

            <div className="flex flex-col items-center gap-3">
              <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto sm:min-w-72">
                {status === "sending" ? "Envoi en cours…" : "Envoyer ma réponse"}
              </Button>
              <p className="text-small text-navy/80">
                Réponse souhaitée avant le {formatLongDate(wedding.rsvp.deadline)}.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
