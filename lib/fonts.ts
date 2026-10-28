// Polices du site, centralisées ici : c'est le SEUL fichier à modifier pour
// passer aux polices officielles de la carte.
//
// TODO: Burgues Script et TT Ramillas sont des polices commerciales. Dès que les
// fichiers .woff2 sous licence sont déposés dans /public/fonts/, remplacer les
// deux imports Google ci-dessous par :
//
//   import localFont from "next/font/local";
//   export const scriptFont = localFont({
//     src: "../public/fonts/BurguesScript.woff2",
//     variable: "--font-burgues",
//     display: "swap",
//   });
//   export const serifFont = localFont({
//     src: [
//       { path: "../public/fonts/TTRamillas-Regular.woff2", weight: "400", style: "normal" },
//       { path: "../public/fonts/TTRamillas-Italic.woff2", weight: "400", style: "italic" },
//       { path: "../public/fonts/TTRamillas-Medium.woff2", weight: "500", style: "normal" },
//     ],
//     variable: "--font-ramillas",
//     display: "swap",
//   });
//
// En attendant, on utilise deux polices libres proches (OFL).
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";

export const scriptFont = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-burgues",
  display: "swap",
});

export const serifFont = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-ramillas",
  display: "swap",
});
