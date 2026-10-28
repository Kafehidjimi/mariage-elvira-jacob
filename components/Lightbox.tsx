"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import type { Photo } from "@/data/wedding";

type Props = {
  photos: readonly Photo[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function Lightbox({ photos, index, onIndexChange, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);
  const photo = photos[index];
  const count = photos.length;

  const prev = () => onIndexChange((index - 1 + count) % count);
  const next = () => onIndexChange((index + 1) % count);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
      else if (event.key === "ArrowRight") onIndexChange((index + 1) % count);
      else if (event.key === "Tab" && dialogRef.current) {
        const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button"));
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, index, onClose, onIndexChange]);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} sur ${count}`}
      className="on-navy fixed inset-0 z-[70] flex items-center justify-center bg-navy-deep/95 text-beige"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(delta) > 50) {
          if (delta > 0) prev();
          else next();
        }
      }}
    >
      <figure className="relative h-[82svh] w-[92vw] max-w-3xl">
        <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="92vw" className="object-contain" />
        <figcaption className="sr-only">{photo.alt}</figcaption>
      </figure>
      <p className="label absolute bottom-5 left-1/2 -translate-x-1/2" aria-live="polite">
        {index + 1} / {count}
      </p>
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Fermer" className="absolute right-3 top-3 flex size-12 items-center justify-center">
        <X className="size-7" aria-hidden />
      </button>
      <button type="button" onClick={prev} aria-label="Photo précédente" className="absolute left-1 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center sm:left-4">
        <ChevronLeft className="size-8" aria-hidden />
      </button>
      <button type="button" onClick={next} aria-label="Photo suivante" className="absolute right-1 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center sm:right-4">
        <ChevronRight className="size-8" aria-hidden />
      </button>
    </div>,
    document.body,
  );
}
