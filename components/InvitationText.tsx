import { FrameCorner } from "@/components/ui/GeometricFrame";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";
import { wedding } from "@/data/wedding";

export function InvitationText() {
  return (
    <section id="invitation" aria-label="Invitation" className="paper px-5 pb-12 pt-24 sm:px-8 sm:pt-32">
      <Reveal className="relative mx-auto max-w-3xl px-6 py-14 text-center sm:px-16 sm:py-20">
        <FrameCorner className="absolute left-0 top-0 size-14 text-beige-ornament sm:size-20" />
        <FrameCorner className="absolute right-0 top-0 size-14 rotate-90 text-beige-ornament sm:size-20" />
        <FrameCorner className="absolute bottom-0 right-0 size-14 rotate-180 text-beige-ornament sm:size-20" />
        <FrameCorner className="absolute bottom-0 left-0 size-14 -rotate-90 text-beige-ornament sm:size-20" />
        <Monogram className="mx-auto mb-8 size-16 text-navy" />
        <p className="text-balance font-serif text-h3 font-medium uppercase tracking-[0.12em]">{wedding.texts.invitation}</p>
      </Reveal>
    </section>
  );
}
