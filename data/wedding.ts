// Tout le contenu du site. Les textes officiels sont repris mot pour mot de la
// carte d'invitation (Empire Lopes Design) : ne pas les reformuler.
import type { StaticImageData } from "next/image";

import coupleChaise from "@/public/images/couple-chaise.jpg";
import coupleEnlace from "@/public/images/couple-enlace.jpg";
import coupleRegard from "@/public/images/couple-regard.jpg";
import coupleTabouret from "@/public/images/couple-tabouret.jpg";
import coupleWax from "@/public/images/couple-wax.jpg";
import elviraAlliance from "@/public/images/elvira-alliance.jpg";
import elviraPortrait from "@/public/images/elvira-portrait.jpg";
import jacobPortrait from "@/public/images/jacob-portrait.jpg";
import jacobTabouret from "@/public/images/jacob-tabouret.jpg";

export type Person = {
  firstName: string;
  lastName: string;
  verse: { text: string; reference: string };
  photo: Photo | null;
};

export type Photo = {
  src: StaticImageData;
  alt: string;
  orientation: "portrait" | "landscape";
  size: "small" | "medium" | "large";
};

export type EventIcon = "rings" | "church" | "dinner";

export type WeddingEvent = {
  id: "civil" | "religieux";
  title: string;
  shortTitle: string;
  /** Début de l'événement, en ISO 8601. Abidjan = UTC+0 toute l'année. */
  start: string;
  /** Fin estimée, utilisée seulement pour l'agenda. */
  end: string;
  timeLabel: string;
  venue: string;
  /** Nom exact affiché sur la carte. */
  venueOnCard: string;
  address: string;
  city: string;
  description: string;
  mapsUrl: string | null;
  icon: EventIcon;
};

export type Contact = { display: string; e164: string };

export const wedding = {
  bride: {
    firstName: "Elvira",
    lastName: "DAGROU",
    verse: {
      text: "Comme un pommier au milieu des arbres de la forêt, tel est mon bien-aimé parmi les jeunes hommes. J'ai désiré m'asseoir à son ombre, et son fruit est doux à mon palais.",
      reference: "Cantique 2:3",
    },
    photo: {
      src: elviraPortrait,
      alt: "Elvira, en robe rose, sourit derrière ses lunettes",
      orientation: "portrait",
      size: "large",
    },
  } satisfies Person,

  groom: {
    firstName: "Jacob",
    lastName: "BADIBA",
    verse: {
      text: "Il y a soixante reines, quatre-vingts concubines, et des jeunes filles sans nombre. Une seule est ma colombe, ma parfaite ; elle est l'unique de sa mère, la préférée de celle qui lui donna le jour. Les jeunes filles la voient, et la disent heureuse ; les reines et les concubines aussi, et elles la louent.",
      reference: "Cantique 6:8-9",
    },
    photo: {
      src: jacobPortrait,
      alt: "Jacob, en pull à losanges et chemise blanche, les mains dans les poches",
      orientation: "portrait",
      size: "large",
    },
  } satisfies Person,

  /** Ordre d'affichage des prénoms. La carte écrit « Elvira & Jacob ». */
  // TODO: confirmer l'ordre avec les mariés (la carte dit Elvira & Jacob, le brief Jacob & Elvira).
  nameOrder: ["bride", "groom"] as const,

  texts: {
    cardTitle: "Invitation d'honneur",
    openButton: "Ouvrir l'invitation",
    invitation:
      "En accord avec nos familles respectives, nous avons l'immense joie de vous convier à la célébration de notre union.",
    heroTagline: "Deux familles, une seule promesse.",
    datesLine: "05 & 07 novembre 2026 · Abidjan",
    storyTitle: "Une histoire écrite à deux",
    // TODO: texte court de l'histoire du couple, s'il est fourni. Laisser null pour n'afficher que les versets.
    storyIntro: null as string | null,
    galleryTitle: "Instants choisis",
    countdownTitle: "Le début d'une nouvelle aventure",
    countdownLive: "C'est aujourd'hui. Merci d'être à nos côtés.",
    countdownAfter: "Merci du fond du cœur d'avoir partagé ces jours avec nous.",
    programTitle: "Le programme",
    dressCodeTitle: "Dress code",
    dressCodeText:
      "Pour accompagner nos couleurs, nous vous invitons à porter du bleu profond, du crème ou de l'ivoire.",
    rsvpTitle: "Votre présence nous fera honneur",
    rsvpIntro: "Merci de nous confirmer votre présence avant le",
    rsvpClosed:
      "Les réponses en ligne sont closes. Pour toute question sur votre venue, appelez-nous directement.",
    contactTitle: "Pour plus d'informations",
    closing: "Avec tout notre amour",
    designCredit: "Design de la carte : Empire Lopes Design",
  },

  events: [
    {
      id: "civil",
      title: "Mariage civil",
      shortTitle: "le mariage civil",
      start: "2026-11-05T11:00:00Z",
      end: "2026-11-05T13:00:00Z",
      timeLabel: "À partir de 11h",
      venue: "Mairie d'Adjamé",
      venueOnCard: "Mairie d'Adjamé",
      // TODO: adresse précise de la mairie.
      address: "Mairie d'Adjamé",
      city: "Abidjan",
      description: "Échange des consentements devant l'officier d'état civil.",
      // TODO: lien Google Maps exact de la Mairie d'Adjamé (recherche par défaut).
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mairie+d%27Adjam%C3%A9+Abidjan",
      icon: "rings",
    },
    {
      id: "religieux",
      title: "Mariage religieux",
      shortTitle: "le mariage religieux",
      start: "2026-11-07T13:00:00Z",
      end: "2026-11-07T18:00:00Z",
      timeLabel: "À partir de 13h",
      venue: "Église des Assemblées de Dieu",
      venueOnCard: "Église des AD Yop PB2",
      // TODO: adresse précise de l'église.
      address: "Yopougon PB2",
      city: "Abidjan",
      description: "Bénédiction nuptiale, suivie du repas.",
      // Lien encodé dans le QR code de l'église sur la carte.
      mapsUrl: "https://maps.app.goo.gl/175yEJs6nrCfNewM7",
      icon: "church",
    },
  ] satisfies WeddingEvent[],

  meal: {
    text: "Un repas vous sera servi au sein de l'église.",
    afterEventId: "religieux",
  },

  dressCode: [
    { name: "Bleu profond", hex: "#032076" },
    { name: "Crème / Ivoire", hex: "#F4EEDC" },
  ],

  contacts: [
    { display: "+225 07 59 41 44 73", e164: "+2250759414473" },
    { display: "+225 07 97 60 48 33", e164: "+2250797604833" },
  ] satisfies Contact[],

  rsvp: {
    // TODO: date limite à confirmer (proposition du brief : 2 novembre 2026, fin de journée).
    deadline: "2026-11-02T23:59:59Z",
    // TODO: nombre maximal de personnes par réponse à confirmer (défaut du brief : 2).
    maxGuests: 2,
    eventChoices: [
      { id: "civil", label: "Mariage civil" },
      { id: "religieux", label: "Mariage religieux et repas" },
    ],
  },

  hero: {
    photo: {
      src: coupleEnlace,
      alt: "Elvira et Jacob enlacés, elle en robe rouge, lui en chemise wax",
      orientation: "portrait",
      size: "large",
    } satisfies Photo as Photo | null,
  },

  /** Galerie : la mise en page suit l'ordre et la taille de chaque photo. */
  gallery: [
    { src: coupleWax, alt: "Jacob enlace Elvira par derrière, tous deux en tenue rouge et wax", orientation: "portrait", size: "large" },
    { src: coupleRegard, alt: "Jacob, assis, lève les yeux vers Elvira qui pose la main sur son épaule", orientation: "portrait", size: "medium" },
    { src: elviraAlliance, alt: "Elvira montre sa bague de fiançailles", orientation: "portrait", size: "small" },
    { src: coupleChaise, alt: "Elvira assise, Jacob debout à ses côtés", orientation: "portrait", size: "medium" },
    { src: jacobTabouret, alt: "Jacob assis sur un tabouret en bois, souriant", orientation: "portrait", size: "small" },
    { src: coupleTabouret, alt: "Elvira assise sur les genoux de Jacob, en tenue rouge et wax", orientation: "portrait", size: "large" },
  ] satisfies Photo[] as Photo[],

  music: {
    // Musique d'ambiance : démarre au clic sur « Ouvrir l'invitation », jamais en autoplay.
    enabled: false,
    // TODO: déposer un fichier dans /public/audio/ et renseigner son chemin ici.
    src: null as string | null,
  },

  invitationPdf: "/invitation/carte-invitation.pdf",

  seo: {
    title: "Elvira & Jacob — 05 & 07 novembre 2026",
    description:
      "Elvira DAGROU et Jacob BADIBA vous convient à la célébration de leur union, les 5 et 7 novembre 2026 à Abidjan.",
    // TODO: remplacer par l'adresse définitive du site (variable NEXT_PUBLIC_SITE_URL).
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },
} as const;

export type Wedding = typeof wedding;

export function orderedCouple() {
  return wedding.nameOrder.map((key) => wedding[key]);
}

export function getEvent(id: string): WeddingEvent | undefined {
  return wedding.events.find((event) => event.id === id);
}
