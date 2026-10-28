"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { Lightbox } from "@/components/Lightbox";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { wedding, type Photo } from "@/data/wedding";
import { EASE, viewportOnce } from "@/lib/motion";

// Composition asymétrique : chaque taille occupe une largeur et un décalage différents.
const layout: Record<Photo["size"], string> = {
  large: "col-span-2 md:col-span-5",
  medium: "col-span-1 md:col-span-4 md:mt-24",
  small: "col-span-1 md:col-span-3 md:mt-48",
};

const sizes: Record<Photo["size"], string> = {
  large: "(min-width: 768px) 40vw, 100vw",
  medium: "(min-width: 768px) 32vw, 50vw",
  small: "(min-width: 768px) 24vw, 50vw",
};

export function Gallery() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const photos = wedding.gallery;

  if (photos.length === 0) return null;

  return (
    <section aria-labelledby="galerie-title" className="on-navy navy-texture px-4 py-28 text-ivory sm:px-8 sm:py-36">
      <SectionTitle id="galerie-title" title={wedding.texts.galleryTitle} tone="navy" />
      <ul className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-12 md:gap-6">
        {photos.map((photo, index) => (
          <motion.li
            key={photo.src.src}
            className={layout[photo.size]}
            initial={{ opacity: 0, y: reduce ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: reduce ? 0.3 : 1, ease: EASE, delay: reduce ? 0 : (index % 3) * 0.1 }}
          >
            <button
              type="button"
              onClick={() => setActive(index)}
              className="group relative block aspect-[2/3] w-full overflow-hidden bg-navy-deep"
              aria-label={`Agrandir la photo : ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                placeholder="blur"
                sizes={sizes[photo.size]}
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-card)] group-hover:scale-[1.04] motion-reduce:transition-none"
              />
              <span aria-hidden="true" className="absolute inset-2 border border-beige/0 transition-colors duration-500 group-hover:border-beige/60" />
            </button>
          </motion.li>
        ))}
      </ul>
      {active !== null ? (
        <Lightbox photos={photos} index={active} onIndexChange={setActive} onClose={() => setActive(null)} />
      ) : null}
    </section>
  );
}
