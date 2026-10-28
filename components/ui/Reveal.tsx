"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { reducedFade, slideUp, viewportOnce } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "figure";
};

/** Révélation au scroll, une seule fois. Fondu court si l'utilisateur réduit les animations. */
export function Reveal({ children, className, variants = slideUp, delay = 0, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={reduce ? reducedFade : variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Component>
  );
}
