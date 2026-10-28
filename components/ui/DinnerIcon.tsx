type IconProps = { className?: string; title?: string };

export function DinnerIcon({ className, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 140 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <path d="M18 8 V28 M24 8 V28 M30 8 V28 M18 28 Q24 36 30 28 M24 34 V84" />
      <circle cx="70" cy="46" r="36" />
      <circle cx="70" cy="46" r="27" />
      <rect x="61" y="28" width="18" height="36" rx="1" />
      <path d="M61 44 H79 M66 44 q4 -6 4 0 q0 6 4 0" />
      <path d="M116 84 V8 Q126 22 124 50 H116" />
    </svg>
  );
}
