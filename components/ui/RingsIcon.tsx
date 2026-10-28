type IconProps = { className?: string; title?: string };

export function RingsIcon({ className, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <ellipse cx="44" cy="44" rx="30" ry="24" />
      <ellipse cx="44" cy="44" rx="23" ry="17.5" />
      <ellipse cx="76" cy="38" rx="30" ry="24" />
      <ellipse cx="76" cy="38" rx="23" ry="17.5" />
    </svg>
  );
}
