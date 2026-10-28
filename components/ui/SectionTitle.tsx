import { FrameDivider } from "@/components/ui/GeometricFrame";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  id?: string;
  tone?: "navy" | "ivory";
  className?: string;
};

/** Titre de section : petite étiquette en capitales, grand titre en script, filet géométrique. */
export function SectionTitle({ eyebrow, title, id, tone = "ivory", className = "" }: Props) {
  const ornament = tone === "navy" ? "text-beige" : "text-beige-ornament";
  return (
    <Reveal className={`flex flex-col items-center gap-4 text-center ${className}`}>
      {eyebrow ? <p className="label">{eyebrow}</p> : null}
      <h2 id={id} className="font-script text-h2 font-normal">
        {title}
      </h2>
      <FrameDivider className={`h-4 w-40 ${ornament}`} />
    </Reveal>
  );
}
