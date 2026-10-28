import { GeometricFrame } from "@/components/ui/GeometricFrame";
import { Monogram } from "@/components/ui/Monogram";
import { wedding } from "@/data/wedding";

export function Footer() {
  return (
    <footer className="on-navy navy-texture relative overflow-hidden px-5 pb-10 pt-24 text-center text-beige sm:px-8">
      <GeometricFrame className="pointer-events-none absolute left-1/2 top-6 h-[140%] -translate-x-1/2 text-beige/15" strokeWidth={2} />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
        <Monogram className="size-20" />
        <p className="font-script text-h2 text-ivory">{wedding.texts.closing}</p>
        <p className="label">
          {wedding.bride.firstName} {wedding.bride.lastName} &amp; {wedding.groom.firstName} {wedding.groom.lastName}
        </p>
        <p className="label">{wedding.texts.datesLine}</p>
        <p className="mt-16 text-small text-beige/80">{wedding.texts.designCredit}</p>
      </div>
    </footer>
  );
}
