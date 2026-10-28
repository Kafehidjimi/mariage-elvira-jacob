import { orderedCouple } from "@/data/wedding";

type Props = {
  /** « card » : composition de la page 1 (prénoms en grand, & script entrelacé).
   *  « script » : composition de la page 2 (prénom script, NOM en capitales). */
  variant?: "card" | "script";
  as?: "h1" | "h2" | "p";
  className?: string;
};

export function CoupleNames({ variant = "card", as: Tag = "h1", className = "" }: Props) {
  const [first, second] = orderedCouple();

  if (variant === "script") {
    return (
      <Tag className={`flex flex-col items-center gap-2 text-center ${className}`}>
        <span className="flex flex-col items-center">
          <span className="font-script text-h1 leading-none">{first.firstName}</span>
          <span className="label mt-1 !tracking-[0.35em]">{first.lastName}</span>
        </span>
        <span aria-hidden="true" className="font-script text-h2 leading-none opacity-80">
          &amp;
        </span>
        <span className="sr-only">et</span>
        <span className="flex flex-col items-center">
          <span className="font-script text-h1 leading-none">{second.firstName}</span>
          <span className="label mt-1 !tracking-[0.35em]">{second.lastName}</span>
        </span>
      </Tag>
    );
  }

  return (
    <Tag className={`relative flex flex-col items-center text-center font-serif font-medium ${className}`}>
      <span className="text-display tracking-tight">{first.firstName}</span>
      <span
        aria-hidden="true"
        className="font-script pointer-events-none absolute left-1/2 top-1/2 -translate-x-[40%] -translate-y-[46%] text-h1 font-normal leading-none"
      >
        &amp;
      </span>
      <span className="sr-only"> et </span>
      <span className="text-display tracking-tight">{second.firstName}</span>
    </Tag>
  );
}
