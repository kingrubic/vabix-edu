import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  gold: "bg-vabix-gold text-vabix-deep-teal hover:bg-vabix-soft-gold",
  teal: "bg-vabix-deep-teal text-white hover:bg-vabix-teal",
  outline:
    "border border-current bg-transparent text-inherit hover:bg-white/10",
  ghost: "bg-transparent text-inherit underline-offset-4 hover:underline",
  ivory: "bg-vabix-ivory text-vabix-deep-teal hover:bg-white",
} as const;

type Props = {
  href?: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  href,
  children,
  variant = "gold",
  className = "",
  type = "button",
  disabled,
  onClick,
}: Props) {
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-[15px] font-semibold tracking-wide transition-colors disabled:opacity-60 ${variants[variant]} ${className}`;
  if (href) {
    const external = href.startsWith("http");
    return (
      <Link
        href={href}
        className={cls}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
