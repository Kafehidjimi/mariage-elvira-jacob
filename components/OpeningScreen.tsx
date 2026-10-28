"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { CoupleNames } from "@/components/ui/CoupleNames";
import { GeometricFrame } from "@/components/ui/GeometricFrame";
import { RingsIcon } from "@/components/ui/RingsIcon";
import { wedding } from "@/data/wedding";
import { EASE } from "@/lib/motion";

type Props = { onStart: () => void; onOpened: () => void };

type Phase = "closed" | "opening";

// Séquence d'ouverture (~2,1 s) : le bouton s'efface, le cadre s'élargit,
// le bleu se retourne en ivoire comme la page 2 de la carte, puis tout s'efface.
const full: Record<string, Variants> = {
  overlay: { closed: { opacity: 1 }, opening: { opacity: 0, transition: { delay: 1.5, duration: 0.6, ease: EASE } } },
  button: { closed: { opacity: 1, scale: 1 }, opening: { opacity: 0, scale: 0.94, transition: { duration: 0.35, ease: EASE } } },
  content: { closed: { opacity: 1, y: 0 }, opening: { opacity: 0, y: -14, transition: { delay: 0.15, duration: 0.6, ease: EASE } } },
  frame: { closed: { opacity: 1, scale: 1 }, opening: { opacity: 0, scale: 1.45, transition: { delay: 0.25, duration: 1.15, ease: EASE } } },
  ivory: { closed: { opacity: 0 }, opening: { opacity: 1, transition: { delay: 0.7, duration: 0.75, ease: EASE } } },
};

const reduced: Record<string, Variants> = {
  overlay: { closed: { opacity: 1 }, opening: { opacity: 0, transition: { duration: 0.35 } } },
  button: { closed: { opacity: 1 }, opening: { opacity: 1 } },
  content: { closed: { opacity: 1 }, opening: { opacity: 1 } },
  frame: { closed: { opacity: 1 }, opening: { opacity: 1 } },
  ivory: { closed: { opacity: 0 }, opening: { opacity: 0 } },
};

export function OpeningScreen({ onStart, onOpened }: Props) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("closed");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const v = reduce ? reduced : full;

  // Le focus part du bouton, même si l'URL contient une ancre (#rsvp…).
  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const open = () => {
    if (phase !== "closed") return;
    onStart();
    setPhase("opening");
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-title"
      className="on-navy navy-texture fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-4 text-ivory"
      variants={v.overlay}
      initial="closed"
      animate={phase}
      onAnimationComplete={(definition) => {
        if (definition === "opening") onOpened();
      }}
    >
      <motion.div aria-hidden="true" variants={v.ivory} className="paper absolute inset-0" />

      <div className="@container relative h-[min(92svh,calc((100vw-2rem)*1.72))] w-full max-w-[calc(92svh*1000/1406)]">
        <motion.div variants={v.frame} className="absolute inset-0 text-beige">
          <GeometricFrame draw stretch className="size-full" />
        </motion.div>

        <motion.div
          variants={v.content}
          className="absolute inset-0 flex flex-col items-center justify-between px-[12cqw] pb-[22cqw] pt-[22cqw] text-center"
        >
          <p id="opening-title" className="max-w-[56cqw] font-script text-[9.5cqw] leading-[0.95] text-ivory">
            {wedding.texts.cardTitle}
          </p>

          <div className="flex flex-col items-center">
            <CoupleNames as="p" className="text-ivory [&_.text-display]:text-[21cqw] [&_.text-display]:leading-[0.92] [&_.text-h1]:text-[17cqw] [&_.text-h1]:text-beige" />
            <RingsIcon className="mt-[3cqw] w-[20cqw] text-beige" />
          </div>

          <motion.div variants={v.button}>
            <button
              ref={buttonRef}
              type="button"
              onClick={open}
              disabled={phase !== "closed"}
              className="label group relative inline-flex min-h-11 items-center justify-center whitespace-nowrap border border-beige/80 bg-navy/60 px-5 py-3 !tracking-[0.14em] sm:px-7 sm:!tracking-[0.2em] text-beige transition-colors duration-300 hover:bg-beige hover:text-navy"
            >
              {wedding.texts.openButton}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
