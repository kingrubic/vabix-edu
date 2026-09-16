import Link from "next/link";
import Image from "next/image";
import { pillars, supportingLayers } from "@/content/pillars";
import {
  heroHeadline as fileHeroHeadline,
  heroSubheadline as fileHeroSubheadline,
  heroSupporting as fileHeroSupporting,
  tagline as fileTagline,
  threeTSubtitle,
  positioning,
  founderQuote,
  founderMessage,
  founderTitleDefault,
} from "@/content/brand";
import { siteConfig } from "@/lib/siteConfig";
import { ecosystemMethodSlugs, homepageFeaturedSlugs, paths } from "@/lib/paths";
import { consultingProcess } from "@/content/consulting";
import { trustworking } from "@/content/trustworking";
import { Button } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ArrowIcon, JsonLd } from "@/components/ui/Misc";
import { ArticleCard } from "@/components/cards/Cards";
import { CTASection } from "@/components/sections/CTASection";
import { breadcrumbJsonLd } from "@/lib/seo";
import {
  publishedFeaturedPrograms,
  publishedArticlesByCategory,
  publishedPage,
  publishedMethodologies,
} from "@/platform/cms/catalog";

export function CorporateHome() {
  const cmsHome = publishedPage("home");
  const heroHeadline = typeof cmsHome?.heroHeadline === "string" ? cmsHome.heroHeadline : fileHeroHeadline;
  const heroSubheadline = typeof cmsHome?.heroSubheadline === "string" ? cmsHome.heroSubheadline : fileHeroSubheadline;
  const heroSupporting = typeof cmsHome?.heroSupporting === "string" ? cmsHome.heroSupporting : fileHeroSupporting;
  const tagline = typeof cmsHome?.tagline === "string" ? cmsHome.tagline : fileTagline;
  const founderTitle = typeof cmsHome?.founderTitle === "string" ? cmsHome.founderTitle : founderTitleDefault;
  const featuredArticles = publishedArticlesByCategory().slice(0, 6);
  const methods = publishedMethodologies().filter((item) => (ecosystemMethodSlugs as readonly string[]).includes(item.slug));
  const featured = publishedFeaturedPrograms().filter((p) => (homepageFeaturedSlugs as readonly string[]).includes(p.slug));
  const bmdo = featured.find((p) => p.slug === "bmdo") ?? publishedFeaturedPrograms().find((p) => p.slug === "bmdo");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", path: "/" }])} />
      <section className="relative overflow-hidden bg-vabix-deep-teal pt-28 text-white sm:pt-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-[480px] w-[480px] bg-[radial-gradient(circle,rgba(222,164,67,0.12),transparent_60%)]" />
        </div>
        <Container className="relative pb-20">
          <p className="eyebrow">VABIX</p>
          <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-vabix-soft-gold uppercase">{tagline}</p>
          <h1 className="mt-5 max-w-5xl text-balance text-[32px] font-semibold leading-[1.15] sm:text-[46px] lg:text-[clamp(44px,4.6vw,64px)]">
            {heroHeadline}
          </h1>
          <p className="measure mt-6 text-base text-white/80 sm:text-lg">{heroSubheadline}</p>
          <p className="measure mt-4 text-sm text-white/70">{heroSupporting}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/tri-thuc" variant="gold">
              Khám phá hệ sinh thái VABIX
            </Button>
            <Button href={paths.consult} variant="outline" className="border-white/40 text-white">
              Trao đổi cùng VABIX
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20" id="ba-mui-nhon">
        <Container>
          <SectionHeading align="center" eyebrow="Ba mũi nhọn — 3T" title="BA MŨI NHỌN — 3T" description={threeTSubtitle} />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.id} className="flex h-full flex-col border border-vabix-deep-teal/10 bg-white p-8">
                <p className="text-sm font-semibold tracking-widest text-vabix-gold">
                  {p.number} · {p.en}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-vabix-deep-teal">{p.vi}</h2>
                <p className="mt-4 flex-1 text-vabix-ink">{p.summary}</p>
                <Link href={p.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-vabix-deep-teal">
                  {p.cta.label} <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20" id="ve-vabix">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Về VABIX</p>
            <h2 className="mt-3 text-3xl font-semibold text-vabix-deep-teal">Hệ sinh thái tri thức thực chiến và phát triển doanh nghiệp</h2>
            <p className="measure mt-4 text-vabix-muted">{positioning}</p>
            <Link href={paths.about} className="mt-6 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
              Hiểu thêm về VABIX <ArrowIcon />
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20" id="dao-tao">
        <Container>
          <SectionHeading
            eyebrow="Đào tạo & huấn luyện"
            title="Chương trình tiêu biểu"
            description="BMDO, MBM, Thao trường khởi nghiệp, ứng dụng AI nâng cao hiệu suất và đào tạo theo yêu cầu doanh nghiệp."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link key={p.slug} href={paths.program(p.slug)} className="flex h-full flex-col border border-vabix-deep-teal/10 bg-white p-6 hover:border-vabix-gold">
                <p className="eyebrow">{p.shortTitle}</p>
                <h3 className="mt-2 text-lg font-semibold text-vabix-deep-teal">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm text-vabix-muted">{p.tagline ?? p.audience}</p>
                <p className="mt-4 text-sm font-semibold text-vabix-gold">{p.duration ?? p.durationNote}</p>
              </Link>
            ))}
          </div>
          <Link href={paths.training} className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Khám phá đào tạo và huấn luyện <ArrowIcon />
          </Link>
        </Container>
      </section>

      {bmdo ? (
        <section className="bg-vabix-deep-teal py-20 text-white" id="bmdo">
          <Container className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Chương trình trọng tâm</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{bmdo.title}</h2>
              <p className="mt-3 text-xl text-vabix-soft-gold">{bmdo.tagline}</p>
              <p className="measure mt-5 text-white/80">{bmdo.shortDescription}</p>
              <p className="mt-6 font-semibold text-vabix-gold">{bmdo.duration}</p>
              <div className="mt-8">
                <Button href={paths.program("bmdo")} variant="gold">
                  Khám phá BMDO
                </Button>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-20" id="tu-van-chuyen-doi">
        <Container>
          <SectionHeading
            eyebrow="Transformation"
            title="Tư vấn chuyển đổi doanh nghiệp"
            description="Đồng hành đánh giá hiện trạng, xác định điểm nghẽn, thiết kế giải pháp, triển khai thay đổi, đo lường và cải tiến."
          />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {consultingProcess.map((s) => (
              <li key={s.step} className="border-t border-vabix-gold pt-4">
                <p className="text-sm font-semibold text-vabix-gold">{s.step}</p>
                <h3 className="mt-2 font-semibold text-vabix-deep-teal">{s.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <Link href={paths.consulting} className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Đánh giá nhu cầu chuyển đổi <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20" id="trustworking">
        <Container>
          <p className="eyebrow">Trustworking</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-vabix-deep-teal sm:text-4xl">{trustworking.headline}</h2>
          <p className="measure mt-4 text-vabix-muted">{trustworking.summary}</p>
          <Link href={paths.trustworking} className="mt-6 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Gửi nhu cầu kết nối <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="py-20" id="mo-hinh">
        <Container>
          <SectionHeading title="Mô hình & phương pháp VABIX" description="The BizCar, APPLIER, MAIS, 3W, KAROT, KLASS, BABOSO và DGH — các mô hình VABIX dùng trong đào tạo và chuyển đổi." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {methods.map((m) => (
              <Link key={m.slug} href={paths.method(m.slug)} className="border border-vabix-deep-teal/10 p-6 hover:border-vabix-gold">
                <p className="eyebrow">{m.shortName}</p>
                <h3 className="mt-2 font-semibold text-vabix-deep-teal">{m.name}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{m.headline}</p>
              </Link>
            ))}
          </div>
          <Link href={paths.methods} className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Khám phá các mô hình & phương pháp <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20" id="tri-thuc">
        <Container>
          <SectionHeading title="Hệ sinh thái tri thức" />
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {supportingLayers.map((l) => (
              <Link key={l.href} href={l.href} className="border border-vabix-deep-teal/10 bg-white p-6 hover:border-vabix-gold">
                <h3 className="font-semibold text-vabix-deep-teal">{l.title}</h3>
                <p className="mt-3 text-sm text-vabix-muted">{l.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20" id="nha-sang-lap">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Thông điệp nhà sáng lập</p>
            <blockquote className="mt-4 text-2xl font-medium text-vabix-deep-teal">“{founderQuote}”</blockquote>
            {(Array.isArray(founderMessage) ? founderMessage : []).slice(0, 2).map((p) => (
              <p key={p} className="measure mt-4 text-vabix-muted">
                {p}
              </p>
            ))}
            <p className="mt-6 font-semibold text-vabix-deep-teal">{siteConfig.founder.name}</p>
            <p className="text-sm text-vabix-muted">{founderTitle}</p>
          </div>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden bg-vabix-deep-teal">
            <Image src="/images/portraits/nguyen-chi-thanh.png" alt="Nguyễn Chí Thành, nhà sáng lập VABIX" fill className="object-cover object-top" sizes="400px" />
          </div>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20" id="goc-chia-se">
        <Container>
          <SectionHeading title="Góc chia sẻ" description="Bài viết mới nhất từ hệ sinh thái tri thức VABIX." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <Link href={paths.insights} className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Xem góc chia sẻ <ArrowIcon />
          </Link>
        </Container>
      </section>

      <CTASection
        title="Doanh nghiệp của bạn đang cần thay đổi điều gì?"
        description="VABIX đồng hành từ nhu cầu thật — đào tạo, chuyển đổi hoặc Trustworking — đánh giá bằng bằng chứng."
        primary={{ label: "Trao đổi cùng VABIX", href: paths.consult }}
        secondary={{ label: "Khám phá hệ sinh thái VABIX", href: "/tri-thuc" }}
      />
    </>
  );
}
