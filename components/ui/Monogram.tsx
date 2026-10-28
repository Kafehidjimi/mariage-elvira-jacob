import { wedding } from "@/data/wedding";

type Props = { className?: string };

/** Monogramme : initiales en script dans un petit octogone, rappel du cadre. */
export function Monogram({ className }: Props) {
  const [first, second] = wedding.nameOrder.map((key) => wedding[key].firstName[0]);
  return (
    <svg viewBox="0 0 120 120" fill="none" role="img" className={className}>
      <title>{`${wedding.bride.firstName} & ${wedding.groom.firstName}`}</title>
      <path
        d="M40 4 H80 L116 40 V80 L80 116 H40 L4 80 V40 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M60 10 L110 60 L60 110 L10 60 Z" stroke="currentColor" strokeWidth="0.75" opacity="0.55" />
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-script)", fontSize: 40 }}
      >
        {first}
        <tspan style={{ fontSize: 26 }} dx="2" dy="-2">
          &amp;
        </tspan>
        <tspan dx="2" dy="2">
          {second}
        </tspan>
      </text>
    </svg>
  );
}
