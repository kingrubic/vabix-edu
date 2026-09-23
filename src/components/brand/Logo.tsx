import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

const sources = {
  light: { src: "/brand/logo-lockup-light.png", width: 1024, height: 292 },
  dark: { src: "/brand/logo-lockup-dark.png", width: 430, height: 124 },
} as const;

export function Logo({ variant = "light", className = "h-11 max-w-[min(210px,48vw)] sm:h-[52px]", priority }: LogoProps) {
  const img = sources[variant];
  return (
    <Image
      src={img.src}
      alt="VABIX — Kết tri thức. Nối giá trị."
      width={img.width}
      height={img.height}
      className={`w-auto object-contain object-left ${className}`}
      priority={priority}
    />
  );
}

export function BrandLockup({
  tone = "onDark",
  markClassName = "h-12 sm:h-14",
  priority,
  tagline = true,
}: {
  tone?: "onDark" | "onLight";
  markClassName?: string;
  priority?: boolean;
  tagline?: boolean;
}) {
  const name = tone === "onLight" ? "text-vabix-deep-teal" : "text-[#f8f5ed]";
  const tag = tone === "onLight" ? "text-vabix-deep-teal/65" : "text-[#f8f5ed]/75";
  return (
    <span className={`inline-flex items-center ${tagline ? "gap-2.5" : "gap-3"}`}>
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={948}
        height={958}
        priority={priority}
        className={`w-auto shrink-0 object-contain ${markClassName}`}
      />
      <span className="leading-none">
        <span className={`block font-semibold tracking-[0.16em] whitespace-nowrap ${tagline ? "text-[15px] sm:text-[17px]" : "text-[18px] sm:text-[20px]"} ${name}`}>
          VABIX
        </span>
        {tagline ? <span className={`mt-1 block text-[10px] sm:text-[11px] ${tag}`}>{siteConfig.tagline}</span> : null}
      </span>
    </span>
  );
}

export function Emblem({ className = "h-10 w-10", priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/emblem.png"
      alt=""
      width={292}
      height={292}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
