import { cn } from "@/lib/cn";

type Variant = "primary" | "sun" | "cyan" | "pink" | "lime" | "ghost" | "dark";

const variantClass: Record<Variant, string> = {
  primary: "bg-arena text-white",
  sun: "bg-sun text-black",
  cyan: "bg-popcyan text-black",
  pink: "bg-poppink text-black",
  lime: "bg-poplime text-black",
  ghost: "bg-cream text-black",
  dark: "bg-elevated text-cream",
};

export function BrutaButton({
  variant = "primary",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={cn(
        "bruta-press cursor-pointer rounded-xl border-[3px] border-black px-5 py-3 font-display text-sm font-bold uppercase tracking-wide shadow-bruta",
        variantClass[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function BrutaLink({
  variant = "primary",
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a
      {...props}
      className={cn(
        "bruta-press inline-flex cursor-pointer items-center justify-center rounded-xl border-[3px] border-black px-5 py-3 font-display text-sm font-bold uppercase tracking-wide shadow-bruta",
        variantClass[variant],
        className
      )}
    >
      {children}
    </a>
  );
}

export function BrutaCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border-[3px] border-black bg-card shadow-bruta",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BrutaBadge({
  color = "#FFD02B",
  className,
  children,
}: {
  color?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 border-black px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-black",
        className
      )}
      style={{ background: color }}
    >
      {children}
    </span>
  );
}

export function Sticker({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-block rotate-[-4deg] rounded-lg border-[3px] border-black bg-livered px-3 py-1 font-comic text-xl tracking-wide text-white shadow-bruta",
        className
      )}
    >
      {children}
    </span>
  );
}
