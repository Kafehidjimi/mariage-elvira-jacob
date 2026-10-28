"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";

import { useInvitationOpened } from "@/components/InvitationContext";
import { CoupleNames } from "@/components/ui/CoupleNames";
import { FrameDivider } from "@/components/ui/GeometricFrame";
import { wedding } from "@/data/wedding";
import { EASE } from "@/lib/motion";

function subscribeDesktop(callback: () => void) {
  const query = window.matchMedia("(min-width: 1024px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

export function Hero() {
  const opened = useInvitationOpened();
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Parallaxe très légère, seulement sur grand écran et sans reduced-motion.
  const parallax = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const photo = wedding.hero.photo;

  const show = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: opened ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 18 },
    transition: { duration: reduce ? 0.3 : 1, ease: EASE, delay: reduce ? 0 : delay },
  });

  if (!photo) {
    return (
      <section id="accueil" ref={ref} className="paper relative flex min-h-svh items-center justify-center px-4 py-24">
        <motion.div {...show(0.1)} className="flex flex-col items-center gap-6 text-center">
          <CoupleNames variant="script" as="h1" />
          <p className="text-h3 italic">{wedding.texts.heroTagline}</p>
          <p className="label">{wedding.texts.datesLine}</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      id="accueil"
      ref={ref}
      aria-labelledby="hero-title"
      className="on-navy relative isolate flex min-h-svh overflow-hidden bg-navy text-ivory"
    >
      <motion.div
        className="absolute inset-0 -z-10 lg:left-[46%]"
        style={desktop && !reduce ? { y: parallax } : undefined}
      >
        <motion.div
          className="relative size-full"
          initial={{ scale: reduce ? 1 : 1.08 }}
          animate={{ scale: opened || reduce ? 1 : 1.08 }}
          transition={{ duration: 2.2, ease: EASE }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            placeholder="blur"
            quality={75}
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-cover object-[50%_22%]"
          />
        </motion.div>
        {/* Voile navy pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10 lg:bg-gradient-to-r lg:from-navy lg:via-navy/25 lg:to-transparent" />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-end px-5 pb-32 pt-32 sm:px-8 lg:justify-center lg:pb-16">
        <div className="flex max-w-xl flex-col items-center text-center lg:w-[46%] lg:max-w-none">
          <motion.p {...show(0.2)} className="label text-beige">
            {wedding.texts.cardTitle}
          </motion.p>
          <motion.div {...show(0.35)} className="mt-4">
            <CoupleNames variant="script" as="h1" className="text-ivory [&_.label]:text-beige" />
            <span id="hero-title" className="sr-only">
              Mariage de {wedding.bride.firstName} {wedding.bride.lastName} et {wedding.groom.firstName}{" "}
              {wedding.groom.lastName}
            </span>
          </motion.div>
          <motion.div {...show(0.55)} className="mt-6 flex flex-col items-center gap-4">
            <FrameDivider className="h-4 w-40 text-beige" />
            <p className="text-h3 italic text-ivory">{wedding.texts.heroTagline}</p>
            <p className="label text-beige">{wedding.texts.datesLine}</p>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#invitation"
        {...show(0.9)}
        className="absolute bottom-6 left-1/2 flex min-h-11 -translate-x-1/2 flex-col items-center gap-2 text-beige lg:left-[23%]"
      >
        <span className="label text-[0.6875rem]">Découvrir</span>
        <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-beige/30">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-beige motion-reduce:animate-none" />
        </span>
      </motion.a>
    </section>
  );
}
