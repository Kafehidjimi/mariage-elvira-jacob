import { Download, Phone } from "lucide-react";

import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { wedding } from "@/data/wedding";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-3-.2-.3a8.2 8.2 0 1 1 6.9 3.9Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="paper px-5 py-28 sm:px-8 sm:py-36">
      <SectionTitle id="contact-title" title={wedding.texts.contactTitle} />
      <Reveal className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-12">
        <ul className="grid w-full gap-6 sm:grid-cols-2">
          {wedding.contacts.map((contact) => (
            <li key={contact.e164} className="flex flex-col items-center gap-4 border border-navy/15 bg-white px-5 py-8 text-center">
              <a href={`tel:${contact.e164}`} className="inline-flex min-h-11 items-center font-serif text-h3 font-medium lining-nums tabular-nums">
                {contact.display}
              </a>
              <div className="flex flex-wrap justify-center gap-3">
                <LinkButton href={`tel:${contact.e164}`} variant="outline" aria-label={`Appeler le ${contact.display}`}>
                  <Phone className="size-4" aria-hidden />
                  Appeler
                </LinkButton>
                <LinkButton
                  href={`https://wa.me/${contact.e164.replace("+", "")}`}
                  external
                  variant="primary"
                  aria-label={`Écrire sur WhatsApp au ${contact.display}`}
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </LinkButton>
              </div>
            </li>
          ))}
        </ul>
        <LinkButton href={wedding.invitationPdf} download variant="outline">
          <Download className="size-4" aria-hidden />
          Télécharger l&apos;invitation
        </LinkButton>
      </Reveal>
    </section>
  );
}
