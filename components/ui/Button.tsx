import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "outline-light" | "ghost-light";

const base =
  "label inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 text-center transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-ivory hover:bg-navy-deep",
  outline: "border border-navy text-navy hover:bg-navy hover:text-ivory",
  "outline-light": "border border-beige/70 text-beige hover:bg-beige hover:text-navy",
  "ghost-light": "text-beige underline-offset-4 hover:underline",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  download?: boolean;
  "aria-label"?: string;
};

export function LinkButton({ href, children, variant = "primary", className, external, download, ...rest }: LinkButtonProps) {
  if (external || download || href.startsWith("tel:") || href.startsWith("/api/")) {
    return (
      <a
        href={href}
        className={buttonClasses(variant, className)}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: "" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </Link>
  );
}
