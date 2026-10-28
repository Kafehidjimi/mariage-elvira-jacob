import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { orderedCouple, wedding } from "@/data/wedding";
import { FRAME_PATHS } from "@/lib/frame";

export const alt = wedding.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Aperçu de partage (WhatsApp, etc.) : cadre géométrique et prénoms sur fond navy.
// TODO: passer aux fichiers TTF des polices officielles quand ils seront fournis.
export default async function Image() {
  const [script, serif] = await Promise.all([
    readFile(join(process.cwd(), "assets/og/pinyon.ttf")),
    readFile(join(process.cwd(), "assets/og/cormorant.ttf")),
  ]);
  const [first, second] = orderedCouple();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#032076",
          color: "#FAF8F2",
          position: "relative",
        }}
      >
        <svg
          width="430"
          height="604"
          viewBox="0 0 1000 1406"
          style={{ position: "absolute", left: 385, top: 13 }}
          fill="none"
          stroke="#E8DDCB"
          strokeWidth="3"
        >
          {FRAME_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Pinyon", fontSize: 44, color: "#E8DDCB" }}>{wedding.texts.cardTitle}</div>
          <div style={{ fontFamily: "Cormorant", fontSize: 132, lineHeight: 0.95, marginTop: 24 }}>{first.firstName}</div>
          <div style={{ fontFamily: "Pinyon", fontSize: 80, color: "#E8DDCB", lineHeight: 0.6 }}>&amp;</div>
          <div style={{ fontFamily: "Cormorant", fontSize: 132, lineHeight: 0.95 }}>{second.firstName}</div>
          <div style={{ fontFamily: "Cormorant", fontSize: 28, letterSpacing: 6, color: "#E8DDCB", marginTop: 32 }}>
            05 &amp; 07 NOVEMBRE 2026 · ABIDJAN
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pinyon", data: script, style: "normal", weight: 400 },
        { name: "Cormorant", data: serif, style: "normal", weight: 500 },
      ],
    },
  );
}
