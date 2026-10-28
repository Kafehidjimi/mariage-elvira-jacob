import Image from "next/image";

import { RingsIcon } from "@/components/ui/RingsIcon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { orderedCouple, wedding, type Person } from "@/data/wedding";

function PersonColumn({ person, align }: { person: Person; align: "left" | "right" }) {
  const offset = align === "right" ? "md:mt-40" : "";
  return (
    <Reveal as="article" className={`flex flex-col items-center gap-8 ${offset}`}>
      {person.photo ? (
        <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden bg-navy/10">
          <Image
            src={person.photo.src}
            alt={person.photo.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 768px) 24rem, 88vw"
            className="object-cover object-top"
          />
        </div>
      ) : null}
      <div className="flex max-w-md flex-col items-center text-center">
        <h3 className="flex flex-col items-center">
          <span className="font-script text-h1 font-normal leading-none">{person.firstName}</span>
          <span className="label mt-2 !tracking-[0.35em]">{person.lastName}</span>
        </h3>
        <blockquote className="mt-6">
          <p className="text-body italic">« {person.verse.text} »</p>
          <footer className="label mt-4">{person.verse.reference}</footer>
        </blockquote>
      </div>
    </Reveal>
  );
}

export function StorySection() {
  const [first, second] = orderedCouple();
  return (
    <section aria-labelledby="histoire-title" className="paper px-5 pb-28 pt-12 sm:px-8 sm:pb-36">
      <SectionTitle id="histoire-title" title={wedding.texts.storyTitle} />
      {wedding.texts.storyIntro ? (
        <Reveal className="mx-auto mt-10 max-w-2xl text-center text-body">
          <p>{wedding.texts.storyIntro}</p>
        </Reveal>
      ) : null}
      <div className="mx-auto mt-16 grid max-w-6xl items-start gap-16 md:grid-cols-[1fr_auto_1fr] md:gap-10">
        <PersonColumn person={first} align="left" />
        <Reveal className="flex items-center justify-center md:h-full md:pt-[22rem]">
          <RingsIcon className="w-24 text-beige-ornament md:w-28" title="Alliances entrelacées" />
        </Reveal>
        <PersonColumn person={second} align="right" />
      </div>
    </section>
  );
}
