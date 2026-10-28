"use client";

import { motion, useReducedMotion } from "framer-motion";

import { FRAME_PATHS } from "@/lib/frame";
import { drawFrame } from "@/lib/motion";

type Props = {
  className?: string;
  /** Tracé progressif à l'apparition. */
  draw?: boolean;
  delay?: number;
  strokeWidth?: number;
  /** Épouse la forme du conteneur ; le trait reste fin grâce à non-scaling-stroke. */
  stretch?: boolean;
};

export function GeometricFrame({ className, draw = false, delay = 0, strokeWidth, stretch = false }: Props) {
  const reduce = useReducedMotion();
  const animated = draw && !reduce;

  return (
    <svg
      viewBox="0 0 1000 1406"
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? (stretch ? 1 : 1.6)}
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {FRAME_PATHS.map((d, i) =>
        animated ? (
          <motion.path
            key={d}
            d={d}
            variants={drawFrame}
            initial="hidden"
            animate="visible"
            custom={delay + i * 0.25}
            vectorEffect={stretch ? "non-scaling-stroke" : undefined}
          />
        ) : (
          <path key={d} d={d} vectorEffect={stretch ? "non-scaling-stroke" : undefined} />
        ),
      )}
    </svg>
  );
}

/** Fragment d'angle du cadre, pour orner un bloc de texte. */
export function FrameCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className={className}>
      <path d="M2 118 L2 46 L46 2 L118 2" />
      <path d="M14 118 L14 60 L60 14 L118 14" opacity="0.6" />
    </svg>
  );
}

/** Séparateur : deux diagonales qui se croisent autour d'un petit losange. */
export function FrameDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className={className}>
      <path d="M0 12 H96 L108 4 L120 12 L108 20 L96 12" />
      <path d="M240 12 H144 L132 20 L120 12 L132 4 L144 12" />
    </svg>
  );
}
