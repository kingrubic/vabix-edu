import Image from "next/image";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

const sources = {
  light: { src: "/brand/logo-lockup-light.png", width: 1024, height: 292 },
  dark: { src: "/brand/logo-lockup-dark.png", width: 430, height: 124 },
} as const;

export function Logo({ variant = "light", className = "h-11 sm:h-[52px]", priority }: LogoProps) {
  const img = sources[variant];
  return (
    <Image
      src={img.src}
      alt="VABIX — Kết tri thức. Nối giá trị."
      width={img.width}
      height={img.height}
      className={`w-auto max-w-[min(210px,48vw)] object-contain object-left ${className}`}
      priority={priority}
    />
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
