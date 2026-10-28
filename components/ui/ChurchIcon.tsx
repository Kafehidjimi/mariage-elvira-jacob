type IconProps = { className?: string; title?: string };

export function ChurchIcon({ className, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 100"
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
      <path d="M60 4 V18 M54 10 H66" />
      <path d="M38 44 L60 22 L82 44" />
      <path d="M42 40 V96 H78 V40" />
      <path d="M52 96 V76 A8 8 0 0 1 68 76 V96" />
      <path d="M42 58 L28 58 L20 66 V96 H42" />
      <path d="M78 58 L92 58 L100 66 V96 H78" />
      <path d="M26 74 h8 v10 h-8 Z M86 74 h8 v10 h-8 Z" />
      <circle cx="60" cy="52" r="5" />
      <path d="M12 96 H108" />
    </svg>
  );
}
