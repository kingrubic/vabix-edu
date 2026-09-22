import Link from "next/link";
import Image from "next/image";
import { pillars, supportingLayers } from "@/content/pillars";
import { articles } from "@/content/articles";
import { methodologies } from "@/content/methodologies";
import { founderQuote, founderMessage, founderTitleDefault } from "@/content/brand";
import { siteConfig } from "@/lib/siteConfig";
import { ecosystemMethodSlugs, paths } from "@/lib/paths";
import { trustworking } from "@/content/trustworking";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ArrowIcon, JsonLd } from "@/components/ui/Misc";
import { ArticleCard } from "@/components/cards/Cards";
import { CTASection } from "@/components/sections/CTASection";
import { HomeHero } from "@/components/sections/HomeHero";
import { breadcrumbJsonLd } from "@/lib/seo";

const homePrograms = [
  {
    slug: "bmdo",
    featured: true,
    kicker: "BMDO",
    title: "Thao trường Quản trị Doanh nghiệp Toàn diện",
    support: "Theo mô hình The BizCar (BMDO)",
    body: "Giúp doanh chủ nhìn doanh nghiệp như một hệ thống, nhận diện điểm nghẽn và thực hành thiết kế giải pháp ngay trên bài toán doanh nghiệp thật.",
    meta: ["30 buổi thực chiến", "12 miền quản trị", "Học để thiết kế", "Rèn để vận hành"],
    cta: "Khám phá BMDO",
    image: "/images/hero/sihub-workshop.jpg",
    imagePosition: "18% 42%",
  },
  {
    slug: "quan-tri-chien-luoc-digai",
    kicker: "Đào tạo doanh chủ & CEO",
    title: "Quản trị chiến lược trong thời đại DIGAI",
    tagline: "Tư duy chiến lược rõ ràng. Quyết định có căn cứ.",
    body: "Giúp CEO nhìn rõ bối cảnh, xác định ưu tiên và chuyển chiến lược thành phương án hành động phù hợp trong thời đại số và AI.",
    meta: ["Chiến lược", "DIGAI", "Thực hành trên doanh nghiệp"],
    cta: "Khám phá chương trình",
    image: "/images/programs/digai.jpg",
    imagePosition: "28% 42%",
  },
  {
    slug: "thao-truong-khoi-nghiep",
    kicker: "Đào tạo doanh chủ",
    title: "Khởi nghiệp đổi mới sáng tạo",
    tagline: "Từ ý tưởng khác biệt đến mô hình kinh doanh khả thi.",
    body: "Đồng hành cùng người khởi nghiệp kiểm chứng nhu cầu, thiết kế mô hình kinh doanh và thử nghiệm trước khi mở rộng.",
    meta: ["Innovation", "Business Model", "Validation"],
    cta: "Khám phá chương trình",
    image: "/images/programs/khoi-nghiep.jpg",
    imagePosition: "72% 48%",
  },
  {
    slug: "lanh-dao-tinh-thuc",
    kicker: "Đào tạo doanh chủ & CEO",
    title: "Lãnh đạo tỉnh thức và kiến tạo",
    tagline: "Hiểu mình sâu sắc. Dẫn dắt đội ngũ chủ động.",
    body: "Rèn năng lực tự nhận diện, lắng nghe, trao quyền và kiến tạo môi trường để đội ngũ cùng phát triển.",
    meta: ["Leadership", "Self-awareness", "Team Development"],
    cta: "Khám phá chương trình",
    image: "/images/about/vnpt-session.jpg",
    imagePosition: "58% 62%",
  },
] as const;

const homePillarCopy = [
  {
    id: "dao-tao-huan-luyen",
    title: "Đào tạo & Huấn luyện",
    body: "Từ CEO Academy, coaching 1:1 đến chương trình doanh nghiệp theo nhu cầu — tập trung vào năng lực có thể ứng dụng và đo lường.",
    cta: "Khám phá đào tạo",
  },
  {
    id: "tu-van-chuyen-doi",
    title: "Tư vấn chuyển đổi",
    body: "Xác định đúng ưu tiên, thiết kế phương án và đồng hành triển khai chuyển đổi từ chiến lược đến vận hành.",
    cta: "Khám phá chuyển đổi",
  },
  {
    id: "trustworking",
    title: "Kết nối kinh doanh",
    titleRest: "dựa trên niềm tin",
    body: "Kết nối doanh nghiệp, chuyên gia và đối tác trên cơ sở nhu cầu phù hợp, thông tin rõ ràng và giá trị tương hỗ.",
    cta: "Khám phá Trustworking",
  },
] as const;

const transformationSteps = [
  {
    step: "01",
    title: "Đánh giá hiện trạng",
    body: "Nhìn toàn diện chiến lược, thị trường, con người, tài chính và vận hành.",
  },
  {
    step: "02",
    title: "Xác định điểm nghẽn",
    body: "Tách biểu hiện khỏi nguyên nhân và chọn điểm nghẽn cần xử lý trước.",
  },
  {
    step: "03",
    title: "Thiết kế giải pháp",
    body: "Phương án vừa đúng bối cảnh, vừa nằm trong nguồn lực thật.",
  },
  {
    step: "04",
    title: "Đồng hành triển khai",
    body: "Thành kế hoạch, người phụ trách, thời hạn và mốc kiểm tra.",
  },
  {
    step: "05",
    title: "Đo lường & cải tiến",
    body: "Đo bằng dữ liệu, giữ phần đã hiệu quả và chỉnh phần chưa đạt.",
  },
] as const;

const transformationOutputs = ["Ưu tiên rõ", "Kế hoạch hành động", "Người chịu trách nhiệm", "Tiêu chí đo lường"] as const;

export function CorporateHome() {
  const founderTitle = founderTitleDefault;
  const featuredArticles = [...articles].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")).slice(0, 6);
  const methods = methodologies.filter((item) => (ecosystemMethodSlugs as readonly string[]).includes(item.slug));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", path: "/" }])} />
      <HomeHero />

      <section className="vabix-3t-pillars relative overflow-hidden" id="ba-mui-nhon">
        <div className="vabix-3t-pillars-bg" aria-hidden="true">
          <span className="vabix-3t-pillars-glow vabix-3t-pillars-glow-a" />
          <span className="vabix-3t-pillars-glow vabix-3t-pillars-glow-b" />
          <span className="vabix-3t-pillars-ring vabix-3t-pillars-ring-a" />
          <span className="vabix-3t-pillars-ring vabix-3t-pillars-ring-b" />
        </div>
        <Container className="relative z-[1]">
          <div className="vabix-pillar-head">
            <h2>BA MŨI NHỌN — 3T</h2>
            <p>Phát triển năng lực. Chuyển đổi doanh nghiệp. Kết nối cơ hội.</p>
          </div>
          <div className="vabix-pillar-rail" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="vabix-pillar-grid">
            {pillars.map((pillar) => {
              const copy = homePillarCopy.find((item) => item.id === pillar.id);
              if (!copy) return null;
              return (
                <article key={pillar.id} className="vabix-pillar">
                  <span className="vabix-pillar-accent" aria-hidden="true" />
                  <p className="vabix-pillar-kicker">
                    {pillar.number} · {pillar.en}
                  </p>
                  <h3 className={`vabix-pillar-title${"titleRest" in copy ? " vabix-pillar-title-balance" : ""}`}>
                    {copy.title}
                    {"titleRest" in copy ? (
                      <>
                        <br />
                        {copy.titleRest}
                      </>
                    ) : null}
                  </h3>
                  <p className="vabix-pillar-body">{copy.body}</p>
                  <Link href={pillar.href} className="vabix-pillar-cta">
                    {copy.cta}
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="vabix-about" id="ve-vabix">
        <div className="vabix-about-bg" aria-hidden="true">
          <span className="vabix-about-glow vabix-about-glow-a" />
          <span className="vabix-about-glow vabix-about-glow-b" />
          <span className="vabix-about-arc" />
          <span className="vabix-about-arc vabix-about-arc-b" />
        </div>
        <Container className="vabix-about-grid">
          <div className="vabix-about-copy">
            <p className="eyebrow">Về VABIX</p>
            <h2>
              Hệ sinh thái tri thức thực chiến
              <span className="vabix-about-title-rest"> và phát triển doanh nghiệp</span>
            </h2>
            <p className="vabix-about-lead">
              VABIX chuyển hóa tri thức thực chiến thành năng lực hành động, đồng hành cùng doanh chủ và đội ngũ trong đào tạo, chuyển đổi và kiến tạo những quan hệ hợp tác dựa trên niềm tin.
            </p>
            <p className="vabix-about-note">Mỗi giải pháp đều hướng tới khả năng triển khai, kiểm chứng và tạo giá trị dài hạn.</p>
            <Link href={paths.about} className="vabix-about-cta">
              Hiểu thêm về VABIX
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="vabix-about-stage">
            <figure className="vabix-about-main">
              <Image
                src="/images/hero/sihub-workshop.jpg"
                alt="Chuyên gia VABIX chia sẻ trong buổi đào tạo cùng SIHUB, trước doanh nghiệp và startup"
                fill
                unoptimized
                sizes="(max-width: 1023px) 100vw, 62vw"
                className="object-cover"
              />
            </figure>
            <figure className="vabix-about-inset">
              <Image
                src="/images/about/vnpt-session.jpg"
                alt="Buổi đồng hành chuyển đổi tư duy cùng đội ngũ kinh doanh VNPT"
                fill
                unoptimized
                sizes="180px"
                className="object-cover"
              />
            </figure>
            <p className="vabix-about-caption">
              <span>Tri thức thực chiến</span>
              <span className="vabix-about-caption-rule" aria-hidden="true" />
              <span>Kết nối giá trị</span>
            </p>
          </div>
        </Container>
      </section>

      <section className="vabix-programs" id="dao-tao">
        <div className="vabix-programs-bg" aria-hidden="true">
          <span className="vabix-programs-glow vabix-programs-glow-a" />
          <span className="vabix-programs-glow vabix-programs-glow-b" />
          <span className="vabix-programs-arc" />
        </div>
        <Container>
          <div className="vabix-programs-head">
            <div>
              <p className="eyebrow">Đào tạo & huấn luyện</p>
              <h2>Các chương trình đào tạo doanh chủ</h2>
              <p className="vabix-programs-lead">
                Các chương trình thực chiến dành cho doanh chủ, CEO và nhà sáng lập — từ quản trị doanh nghiệp toàn diện, chiến lược, đổi mới sáng tạo đến năng lực lãnh đạo.
              </p>
            </div>
            <Link href={paths.training} className="vabix-programs-all">
              Xem tất cả chương trình
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="vabix-program-grid">
            {homePrograms.map((program) => {
              const featured = "featured" in program && program.featured;
              return (
                <Link key={program.slug} href={paths.program(program.slug)} className={featured ? "vabix-program-feature" : "vabix-program-card"}>
                  <span className="vabix-program-media" aria-hidden="true">
                    <Image
                      src={program.image}
                      alt=""
                      fill
                      unoptimized
                      sizes={featured ? "(max-width: 1023px) 100vw, 46vw" : "(max-width: 767px) 100vw, 24vw"}
                      className="object-cover"
                      style={{ objectPosition: program.imagePosition }}
                    />
                  </span>
                  <div className="vabix-program-body">
                    {featured ? <span className="vabix-program-feature-arc" aria-hidden="true" /> : null}
                    {featured ? <p className="vabix-program-badge">Signature program</p> : null}
                    <div className="vabix-program-persist">
                      <p className="vabix-program-kicker">{program.kicker}</p>
                      <h3>{program.title}</h3>
                    </div>
                    <div className="vabix-program-fade">
                      <div>
                        {"support" in program && program.support ? <p className="vabix-program-support">{program.support}</p> : null}
                        {"tagline" in program && program.tagline ? <p className="vabix-program-tagline">{program.tagline}</p> : null}
                        <p className="vabix-program-desc">{program.body}</p>
                        <ul className="vabix-program-meta">
                          {program.meta.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <span className="vabix-program-cta">
                      {program.cta}
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
            <Link href={paths.training} className="vabix-program-more">
              <span className="vabix-program-more-arc" aria-hidden="true" />
              <p className="vabix-program-kicker">Hệ đào tạo VABIX</p>
              <h3>Khám phá toàn bộ chương trình</h3>
              <p className="vabix-program-desc">Tìm chương trình phù hợp với giai đoạn phát triển và bài toán của doanh nghiệp.</p>
              <span className="vabix-program-cta">
                Xem tất cả
                <ArrowIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      <section className="vabix-xform-section" id="tu-van-chuyen-doi">
        <div className="vabix-xform-bg" aria-hidden="true">
          <span className="vabix-xform-glow vabix-xform-glow-a" />
          <span className="vabix-xform-glow vabix-xform-glow-b" />
          <span className="vabix-xform-arc" />
        </div>
        <Container>
          <SectionHeading
            eyebrow="Transformation"
            title="Tư vấn & đồng hành chuyển đổi doanh nghiệp"
            description="Đồng hành từ chẩn đoán hiện trạng, xác định ưu tiên đến triển khai, đo lường và cải tiến."
          />
          <div className="vabix-xform">
            <div className="vabix-xform-line" aria-hidden="true">
              <span className="vabix-xform-progress" />
              <span className="vabix-xform-led" />
            </div>
            <ol className="vabix-xform-steps">
              {transformationSteps.map((step) => (
                <li key={step.step}>
                  <span className="vabix-xform-node" aria-hidden="true" />
                  <div className="vabix-xform-copy">
                    <p className="vabix-xform-num">{step.step}</p>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="vabix-xform-out">
            <p className="vabix-xform-out-label">Đầu ra của quá trình chuyển đổi</p>
            <p className="vabix-xform-out-list">
              {transformationOutputs.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
          </div>
          <Link href={paths.consulting} className="vabix-xform-cta">
            Bắt đầu đánh giá doanh nghiệp <ArrowIcon className="h-3.5 w-3.5" />
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
            <Image
              src="/images/portraits/nguyen-chi-thanh.jpg"
              alt="Nguyễn Chí Thành, nhà sáng lập VABIX"
              fill
              priority
              unoptimized
              className="object-cover object-top"
              sizes="(min-width: 1024px) 24rem, min(100vw, 24rem)"
            />
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
