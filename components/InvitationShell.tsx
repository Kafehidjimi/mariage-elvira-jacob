"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { InvitationContext } from "@/components/InvitationContext";
import { MusicToggle } from "@/components/MusicToggle";
import { OpeningScreen } from "@/components/OpeningScreen";
import { wedding } from "@/data/wedding";

/**
 * Tient l'état « invitation ouverte » : écran d'ouverture par-dessus le site,
 * scroll bloqué et contenu inerte tant qu'il n'est pas ouvert. Le contenu reste
 * dans le DOM pour le référencement.
 */
export function InvitationShell({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const musicAvailable = wedding.music.enabled && Boolean(wedding.music.src);

  useEffect(() => {
    if (opened) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [opened]);

  const handleStart = useCallback(() => {
    // La musique ne démarre qu'au clic, jamais en autoplay.
    if (!musicAvailable || !wedding.music.src) return;
    const audio = new Audio(wedding.music.src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    audio.play().then(
      () => setMusicOn(true),
      () => setMusicOn(false),
    );
  }, [musicAvailable]);

  const handleOpened = useCallback(() => {
    setOpened(true);
    const hash = window.location.hash;
    if (hash.length > 1) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    }
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setMusicOn(true), () => setMusicOn(false));
    } else {
      audio.pause();
      setMusicOn(false);
    }
  }, []);

  return (
    <InvitationContext.Provider value={{ opened }}>
      {opened ? null : <OpeningScreen onStart={handleStart} onOpened={handleOpened} />}
      <div inert={!opened}>{children}</div>
      {musicAvailable && opened ? <MusicToggle playing={musicOn} onToggle={toggleMusic} /> : null}
    </InvitationContext.Provider>
  );
}
