import type { Metadata, Viewport } from "next";

import { wedding } from "@/data/wedding";
import { scriptFont, serifFont } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(wedding.seo.siteUrl),
  title: wedding.seo.title,
  description: wedding.seo.description,
  openGraph: {
    title: wedding.seo.title,
    description: wedding.seo.description,
    type: "website",
    locale: "fr_FR",
    siteName: `${wedding.bride.firstName} & ${wedding.groom.firstName}`,
  },
  twitter: { card: "summary_large_image", title: wedding.seo.title, description: wedding.seo.description },
};

export const viewport: Viewport = {
  themeColor: "#032076",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${scriptFont.variable} ${serifFont.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
