"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useInvitationOpened } from "@/components/InvitationContext";
import { Monogram } from "@/components/ui/Monogram";
import { EASE } from "@/lib/motion";

const LINKS = [
  { href: "#invitation", label: "Invitation" },
  { href: "#programme", label: "Programme" },
  { href: "#dress-code", label: "Dress code" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const opened = useInvitationOpened();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Le menu apparaît une fois le Hero dépassé.
  useEffect(() => {
    const hero = document.getElementById("accueil");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "-70% 0px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab" && menuRef.current) {
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"));
        const firstItem = items[0];
        const lastItem = items[items.length - 1];
        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const shown = opened && (visible || menuOpen);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: shown ? 0 : "-110%", opacity: shown ? 1 : 0 }}
        transition={{ duration: reduce ? 0.2 : 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-40 border-b border-beige-ornament/40 bg-ivory/90 backdrop-blur-md"
        inert={!shown}
      >
        <nav aria-label="Navigation principale" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <a href="#accueil" className="flex min-h-11 items-center text-navy" aria-label="Retour en haut">
            <Monogram className="size-11" />
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="label inline-flex min-h-11 items-center text-navy/80 transition-colors hover:text-navy">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            ref={toggleRef}
            type="button"
            className="flex size-11 items-center justify-center text-navy md:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-6" aria-hidden />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="menu-mobile"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE }}
            className="on-navy navy-texture fixed inset-0 z-50 flex flex-col px-6 py-4 text-beige md:hidden"
          >
            <div className="flex h-12 items-center justify-end">
              <button
                type="button"
                className="flex size-11 items-center justify-center"
                aria-label="Fermer le menu"
                onClick={() => {
                  setMenuOpen(false);
                  toggleRef.current?.focus();
                }}
              >
                <X className="size-6" aria-hidden />
              </button>
            </div>
            <ul className="flex flex-1 flex-col items-center justify-center gap-6">
              {LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.08 * index + 0.1, duration: 0.5, ease: EASE }}
                >
                  <a href={link.href} onClick={() => setMenuOpen(false)} className="font-script inline-flex min-h-11 items-center text-[2.75rem] leading-none text-ivory">
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <Monogram className="mx-auto mb-6 size-14 text-beige" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
