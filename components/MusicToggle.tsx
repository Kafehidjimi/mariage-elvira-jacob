"use client";

import { Volume2, VolumeX } from "lucide-react";

export function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? "Couper la musique" : "Lancer la musique"}
      className="on-navy fixed bottom-4 left-4 z-40 flex size-12 items-center justify-center rounded-full bg-navy text-beige shadow-lg"
    >
      {playing ? <Volume2 className="size-5" aria-hidden /> : <VolumeX className="size-5" aria-hidden />}
    </button>
  );
}
