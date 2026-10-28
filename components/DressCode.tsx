import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { wedding } from "@/data/wedding";

export function DressCode() {
  return (
    <section id="dress-code" aria-labelledby="dress-title" className="paper px-5 py-28 sm:px-8 sm:py-36">
      <SectionTitle id="dress-title" title={wedding.texts.dressCodeTitle} />
      <Reveal className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-12 text-center">
        <p className="max-w-xl text-body">{wedding.texts.dressCodeText}</p>
        <ul className="grid w-full max-w-xl grid-cols-2 gap-5 sm:gap-8">
          {wedding.dressCode.map((swatch) => (
            <li key={swatch.name} className="flex flex-col items-center gap-4">
              <span
                aria-hidden="true"
                className="block aspect-[4/5] w-full border border-navy/20"
                style={{ backgroundColor: swatch.hex }}
              />
              <span className="label">{swatch.name}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
