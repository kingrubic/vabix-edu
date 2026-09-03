import Image from "next/image";
import Link from "next/link";

export function OrbitalHero() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden>
      <svg viewBox="0 0 520 520" className="h-full w-full">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a7a7e" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#163C3E" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="260" cy="260" r="240" fill="url(#glow)" />
        <g className="orbit-slower origin-center" style={{ transformOrigin: "260px 260px" }}>
          <ellipse cx="260" cy="260" rx="210" ry="118" fill="none" stroke="#DEA443" strokeOpacity="0.35" />
          <circle cx="470" cy="260" r="4" fill="#DEA443" className="node-pulse" />
        </g>
        <g className="orbit-slow origin-center" style={{ transformOrigin: "260px 260px" }}>
          <ellipse cx="260" cy="260" rx="160" ry="210" fill="none" stroke="#E4B862" strokeOpacity="0.25" transform="rotate(28 260 260)" />
          <circle cx="260" cy="50" r="3.5" fill="#E4B862" className="node-pulse" />
        </g>
        <circle cx="260" cy="260" r="90" fill="none" stroke="#DEA443" strokeOpacity="0.45" />
        {[
          [260, 104],
          [390, 180],
          [390, 340],
          [260, 416],
          [130, 340],
          [130, 180],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1="260" y1="260" x2={x} y2={y} stroke="#DEA443" strokeOpacity="0.28" />
            <circle cx={x} cy={y} r="5" fill="#F8F5ED" stroke="#DEA443" />
          </g>
        ))}
      </svg>
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-[132px] w-[132px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white sm:h-[148px] sm:w-[148px]">
        <Image src="/brand/emblem.png" alt="" width={148} height={148} className="h-[92%] w-[92%] object-contain" />
      </div>
    </div>
  );
}

export function NetworkGraph() {
  const nodes = [
    { href: "/mo-hinh-phuong-phap/bizcar", label: "BizCar", x: 50, y: 12 },
    { href: "/mo-hinh-phuong-phap/b2a", label: "B2A", x: 88, y: 42 },
    { href: "/mo-hinh-phuong-phap/baboso", label: "BABOSO", x: 78, y: 82 },
    { href: "/mo-hinh-phuong-phap/kora", label: "KORA", x: 22, y: 82 },
    { href: "/mo-hinh-phuong-phap/klass", label: "KLASS", x: 12, y: 42 },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {nodes.map((n) => (
          <line key={n.label} x1="50" y1="50" x2={n.x} y2={n.y} stroke="#DEA443" strokeOpacity="0.45" />
        ))}
        <circle cx="50" cy="50" r="12" fill="#163C3E" />
      </svg>
      <Link
        href="/mo-hinh-phuong-phap"
        className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white"
        aria-label="Mô hình và phương pháp VABIX"
      >
        <Image src="/brand/emblem.png" alt="" width={80} height={80} className="h-16 w-16 object-contain" />
      </Link>
      {nodes.map((n) => (
        <Link
          key={n.label}
          href={n.href}
          className="absolute z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-vabix-gold bg-vabix-ivory text-center text-[11px] font-semibold text-vabix-deep-teal hover:bg-white"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          {n.label}
        </Link>
      ))}
    </div>
  );
}
