import Image from "next/image";
import {
  heroSupporting,
  heroSubheadline,
  heroTagline,
  heroEyebrow,
} from "@/content/brand";
import { paths } from "@/lib/paths";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Misc";

function KnowledgeNetwork() {
  return (
    <svg
      className="vabix-hero-network pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 820"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M80 140C260 80 420 210 610 160C820 104 980 40 1220 120" stroke="#DEA443" strokeWidth="0.8" />
      <path d="M40 420C220 360 390 510 620 470C860 424 1080 320 1380 380" stroke="#E4B862" strokeWidth="0.7" />
      <path d="M180 680C360 600 560 720 780 640C980 572 1140 700 1360 620" stroke="#DEA443" strokeWidth="0.7" />
      <path d="M700 40C760 180 690 320 780 470C860 600 980 690 1180 760" stroke="#E4B862" strokeWidth="0.6" />
      {[
        [180, 118],
        [610, 160],
        [980, 78],
        [220, 390],
        [620, 470],
        [1080, 348],
        [360, 632],
        [780, 640],
        [1180, 760],
        [860, 250],
      ].map(([x, y], i) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={i % 3 === 0 ? 3.2 : 2.2} fill="#DEA443" className="vabix-hero-node" />
          <circle cx={x} cy={y} r="11" stroke="#DEA443" strokeOpacity="0.35" />
        </g>
      ))}
    </svg>
  );
}

export function HomeHero() {
  return (
    <section className="vabix-hero relative bg-vabix-deep-teal text-[#f4efe4]">
      <div className="vabix-hero-background pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="vabix-hero-glow vabix-hero-glow-teal" />
        <div className="vabix-hero-glow vabix-hero-glow-gold" />
        <div className="vabix-hero-glow vabix-hero-glow-visual" />
        <KnowledgeNetwork />
      </div>

      <div className="relative mx-auto grid min-h-[650px] w-full max-w-[1320px] items-center gap-12 px-5 pb-24 pt-28 sm:min-h-[700px] sm:px-6 sm:pt-32 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.92fr)] lg:gap-14 lg:px-8 lg:pb-28 lg:pt-28 xl:min-h-[720px] xl:gap-16">
        <div className="hero-content max-w-[700px]">
          <p className="vabix-hero-in eyebrow !text-[0.78rem] tracking-[0.2em] text-vabix-gold">{heroEyebrow}</p>
          <p className="vabix-hero-in vabix-hero-in-tagline mt-3 text-[15px] font-medium tracking-[0.04em] text-vabix-soft-gold sm:text-[16px] lg:text-[17px]">
            {heroTagline}
          </p>
          <h1 className="vabix-hero-in vabix-hero-in-title mt-5 max-w-[700px] text-[clamp(2.625rem,1.05rem+3.15vw,3.45rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
            <span className="block">
              <span className="whitespace-nowrap">Chuyển hóa</span>{" "}
              <span className="whitespace-nowrap">tri thức</span>
            </span>
            <span className="block">
              thành{" "}
              <span className="vabix-hero-highlight inline text-vabix-gold sm:whitespace-nowrap">
                <span className="whitespace-nowrap">năng lực</span>{" "}
                <span className="whitespace-nowrap">hành động</span>.
              </span>
            </span>
          </h1>
          <p className="vabix-hero-in vabix-hero-in-copy measure mt-6 max-w-[38rem] text-[17px] leading-[1.65] text-[#f4efe4]/88 sm:text-[19px]">
            {heroSubheadline}
          </p>
          <p className="vabix-hero-in vabix-hero-in-copy-2 measure mt-4 max-w-[34rem] text-[15px] leading-[1.65] text-[#f4efe4]/72 sm:text-[16px]">
            {heroSupporting}
          </p>
          <div className="vabix-hero-in vabix-hero-in-cta mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button
              href="/tri-thuc"
              variant="gold"
              className="group min-h-12 w-full px-6 text-[14px] tracking-[0.04em] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-vabix-soft-gold hover:shadow-[0_12px_28px_rgba(222,164,67,0.28)] sm:w-auto"
            >
              Khám phá hệ sinh thái
              <span className="inline-flex transition-transform duration-300 group-hover:translate-x-[3px]">
                <ArrowIcon />
              </span>
            </Button>
            <Button
              href={paths.consult}
              variant="outline"
              className="min-h-12 w-full border-white/35 px-6 text-[14px] tracking-[0.04em] text-[#f4efe4] transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/[0.08] sm:w-auto"
            >
              Trao đổi cùng VABIX
            </Button>
          </div>
        </div>

        <div className="hero-visual vabix-hero-in vabix-hero-in-visual relative mx-auto w-full max-w-[480px] pb-10 lg:mx-0 lg:max-w-[520px] lg:justify-self-end lg:pb-8 lg:pl-2">
          <div className="vabix-hero-frame relative">
            <div className="vabix-hero-photo relative aspect-[4/5] overflow-hidden shadow-[0_28px_60px_rgba(6,20,22,0.35)] sm:aspect-[5/6] lg:aspect-[4/5]">
              <Image
                src="/images/hero/sihub-workshop.jpg"
                alt="Chuyên gia VABIX đào tạo thực chiến cùng doanh chủ và đội ngũ tại SIHUB"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
                className="object-cover object-[18%_42%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vabix-deep-teal/40 via-transparent to-vabix-deep-teal/12" />
            </div>
            <aside className="vabix-hero-overlay absolute -bottom-4 left-4 w-[min(220px,calc(100%-2rem))] border-l-2 border-vabix-gold bg-vabix-warm/94 px-4 py-3.5 text-vabix-deep-teal shadow-[0_16px_40px_rgba(6,20,22,0.16)] sm:-left-3">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-vabix-gold uppercase">3T</p>
              <ul className="mt-2 space-y-1 text-[12.5px] leading-snug text-vabix-ink">
                <li>Training & Coaching</li>
                <li>Transformation</li>
                <li>Trustworking</li>
              </ul>
            </aside>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1320px] items-end justify-between gap-6 px-5 pb-8 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-vabix-gold/90 uppercase">01 — Hệ sinh thái VABIX</p>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-vabix-warm" />
    </section>
  );
}
