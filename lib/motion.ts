import type { Transition, Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const baseTransition: Transition = { duration: 0.9, ease: EASE };

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: baseTransition },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/** Révélation d'image par masque : le voile ivoire glisse vers le haut. */
export const maskReveal: Variants = {
  hidden: { scaleY: 1 },
  visible: { scaleY: 0, transition: { duration: 1.1, ease: EASE } },
};

export const softZoom: Variants = {
  hidden: { scale: 1.08 },
  visible: { scale: 1, transition: { duration: 1.2, ease: EASE } },
};

/** Tracé progressif du cadre géométrique. */
export const drawFrame: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.6, ease: EASE, delay },
      opacity: { duration: 0.3, delay },
    },
  }),
};

/** Versions réduites pour prefers-reduced-motion : simple fondu court. */
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
