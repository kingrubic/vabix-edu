import { heroSubheadline, heroEyebrow } from "@/content/brand";
import { paths } from "@/lib/paths";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Misc";
import { DualCoreEcosystem } from "@/components/visuals/DualCoreEcosystem";
import { withLocale, type Locale } from "@/i18n/locale";

function KnowledgeNetwork() {
  return (
    <svg
      className="vabix-hero-network pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 820"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M80 140C260 80 420 210 610 160C820 104 980 40 1220 120" stroke="#DEA443" strokeWidth="0.6" />
      <path d="M40 420C220 360 390 510 620 470C860 424 1080 320 1380 380" stroke="#E4B862" strokeWidth="0.5" />
      {[
        [180, 118],
        [610, 160],
        [220, 390],
        [620, 470],
        [1080, 348],
        [860, 250],
      ].map(([x, y], i) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={i % 3 === 0 ? 2.2 : 1.5} fill="#DEA443" className="vabix-hero-node" />
        </g>
      ))}
    </svg>
  );
}

export function HomeHero({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const href = (path: string) => withLocale(path, locale);
  return (
    <section className="vabix-hero relative overflow-hidden bg-vabix-deep-teal text-[#f4efe4]">
      <div className="vabix-hero-background pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="vabix-hero-glow vabix-hero-glow-teal" />
        <div className="vabix-hero-glow vabix-hero-glow-gold" />
        <div className="vabix-hero-glow vabix-hero-glow-visual" />
        <KnowledgeNetwork />
      </div>

      <div className="vabix-shell relative z-10 grid min-h-[640px] items-center pb-14 pt-[96px] sm:min-h-[660px] sm:pb-16 sm:pt-[102px] lg:grid-cols-[minmax(0,0.54fr)_minmax(0,0.46fr)] lg:gap-10 lg:min-h-[680px] lg:pb-16 lg:pt-[108px] xl:gap-12">
        <div className="hero-content max-w-[640px]">
          <p className="vabix-hero-in text-[15px] font-semibold tracking-[0.18em] text-vabix-gold uppercase sm:text-[17px]">
            {en ? "A practical knowledge ecosystem" : heroEyebrow}
          </p>

          <h1 className="vabix-hero-in vabix-hero-in-title vabix-hero-title mt-5">
            <span className="vabix-hero-line">{en ? "Turn knowledge into" : "Chuyển hóa tri thức thành"}</span>
            <span className="vabix-hero-highlight vabix-hero-line">{en ? "the capacity to act" : "năng lực hành động"}</span>
          </h1>

          <p className="vabix-hero-in vabix-hero-in-copy mt-6 max-w-[560px] text-[15px] leading-[1.7] text-[#f4efe4]/82 sm:text-[16px] sm:leading-[1.75]">
            {en
              ? "VABIX works with business owners, CEOs and their teams to build management capability, turn knowledge into results, and grow trusted business relationships."
              : heroSubheadline}
          </p>

          <div className="vabix-hero-in vabix-hero-in-cta mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              href={href("/tri-thuc")}
              variant="gold"
              className="group min-h-[48px] w-full px-5 text-[14px] font-semibold tracking-[0.02em] transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-vabix-soft-gold sm:w-auto"
            >
              {en ? "Explore the ecosystem" : "Khám phá hệ sinh thái"}
              <span className="inline-flex transition-transform duration-200 group-hover:translate-x-[3px]">
                <ArrowIcon className="h-3.5 w-3.5" />
              </span>
            </Button>
            <Button
              href={href(paths.consult)}
              variant="outline"
              className="min-h-[48px] w-full border-white/22 px-5 text-[14px] font-medium tracking-[0.01em] text-[#f4efe4] transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-white/40 hover:bg-white/[0.05] sm:w-auto"
            >
              {en ? "Talk with VABIX" : "Trao đổi cùng VABIX"}
            </Button>
          </div>
        </div>

        <div className="hero-visual vabix-hero-in vabix-hero-in-visual mx-auto mt-10 w-full max-w-[520px] lg:mt-0 lg:max-w-none lg:justify-self-stretch">
          <DualCoreEcosystem locale={locale} />
        </div>
      </div>

      <div className="vabix-hero-seam pointer-events-none absolute inset-x-0 bottom-0 z-[1]" aria-hidden />
    </section>
  );
}
