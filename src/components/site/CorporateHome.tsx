import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/content/articles";
import { siteConfig } from "@/lib/siteConfig";
import { paths } from "@/lib/paths";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ArrowIcon, JsonLd } from "@/components/ui/Misc";
import { ArticleCard } from "@/components/cards/Cards";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomeReviews } from "@/components/sections/HomeReviews";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getLocale } from "@/i18n/server";
import { withLocale } from "@/i18n/locale";
import { chrome } from "@/i18n/nav";
import { homeProgramsEn, knowledgeModelsEn, transformationOutputsEn, transformationStepsEn, twinPillarsEn } from "@/i18n/homeEn";

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

const twinPillars = [
  {
    id: "tri-thuc",
    number: "01",
    tone: "teal",
    title: "Kết nối tri thức",
    lead: "Phát triển nội lực doanh nghiệp thông qua tri thức thực chiến, tư duy hệ thống và năng lực ứng dụng.",
    close: "Tri thức → Năng lực → Hành động",
    items: [
      {
        index: "01",
        title: "Tư vấn chiến lược",
        body: "Chẩn đoán hiện trạng, xác định ưu tiên và xây dựng lộ trình phát triển phù hợp.",
      },
      {
        index: "02",
        title: "Đào tạo doanh chủ & CEO",
        body: "Rèn tư duy quản trị, năng lực điều hành và khả năng ứng dụng trên chính doanh nghiệp.",
      },
      {
        index: "03",
        title: "Đào tạo & huấn luyện đội ngũ",
        body: "Thiết kế chương trình theo nhu cầu, đồng hành ứng dụng và đo lường kết quả thực tế.",
      },
    ],
  },
  {
    id: "kinh-doanh",
    number: "02",
    tone: "gold",
    title: "Kết nối kinh doanh",
    lead: "Kết nối đúng người, đúng nhu cầu và tạo nền tảng cho những quan hệ hợp tác bền vững.",
    close: "Đúng người → Đúng nhu cầu → Giá trị bền vững",
    items: [
      {
        index: "01",
        title: "Kết nối đối tác",
        body: "Giúp doanh nghiệp tìm đối tác phù hợp, bổ sung nguồn lực và mở rộng cơ hội hợp tác.",
      },
      {
        index: "02",
        title: "Kết nối khách hàng",
        body: "Giúp doanh nghiệp tiếp cận đúng khách hàng tiềm năng và phát triển thị trường.",
      },
      {
        index: "03",
        title: "Kết nối nhân lực",
        body: "Kết nối nguồn nhân lực lõi, nhân lực mở và nhân lực số phù hợp với từng giai đoạn phát triển.",
      },
    ],
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

const knowledgeModels = [
  { slug: "bizcar", index: "01", name: "The BizCar", line: "Thiết kế và vận hành doanh nghiệp toàn diện.", x: 20, y: 20 },
  { slug: "applier", index: "02", name: "APPLIER", line: "Học để nhìn rõ. Thiết kế để làm được.", x: 50, y: 12 },
  { slug: "mais", index: "03", name: "MAIS", line: "Đo lường → Phân tích → Cải tiến → Chuẩn hóa.", x: 80, y: 20 },
  { slug: "3w", index: "04", name: "3W", line: "WOW · WELL · WIN", x: 88, y: 50 },
  { slug: "karot", index: "05", name: "KAROT", line: "Rõ đích đến · Đúng vấn đề · Tập trung nguồn lực.", x: 80, y: 82 },
  { slug: "klass", index: "06", name: "KLASS", line: "Xây nền vững · Thực hành có hướng dẫn · Phát triển bằng bằng chứng.", x: 50, y: 90 },
  { slug: "baboso", index: "07", name: "BABOSO", line: "Được biết đến · Được cân nhắc · Được lựa chọn.", x: 20, y: 82 },
  { slug: "dgh", index: "08", name: "DGH", line: "Khung định hướng chuyển đổi Số · Xanh · Hạnh phúc.", x: 12, y: 50 },
] as const;

export async function CorporateHome() {
  const locale = await getLocale();
  const en = locale === "en";
  const href = (path: string) => withLocale(path, locale);
  const ui = chrome(locale);
  const programs = en ? homeProgramsEn : homePrograms;
  const pillars = en ? twinPillarsEn : twinPillars;
  const steps = en ? transformationStepsEn : transformationSteps;
  const outputs = en ? transformationOutputsEn : transformationOutputs;
  const models = en ? knowledgeModelsEn : knowledgeModels;
  const featuredArticles = [...articles].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")).slice(0, 6);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: en ? "Home" : "Trang chủ", path: en ? "/en" : "/" }])} />
      <HomeHero locale={locale} />

      <section className="vabix-3t-pillars relative overflow-hidden" id="ba-mui-nhon">
        <div className="vabix-3t-pillars-bg" aria-hidden="true">
          <span className="vabix-3t-pillars-glow vabix-3t-pillars-glow-a" />
          <span className="vabix-3t-pillars-glow vabix-3t-pillars-glow-b" />
        </div>
        <Container className="relative z-[1]">
          <header className="vabix-twin-intro">
            <p className="eyebrow">{en ? "The VABIX ecosystem" : "Hệ sinh thái VABIX"}</p>
            <h2>{en ? "Two pillars of business growth" : "Hai trụ cột phát triển doanh nghiệp"}</h2>
            <p>{en ? "Build capability through knowledge. Open opportunity through connection." : "Xây nội lực từ tri thức. Mở rộng cơ hội bằng kết nối."}</p>
          </header>
          <p className="vabix-twin-chain">
            <span>{en ? "Knowledge" : "Tri thức"}</span>
            <i aria-hidden="true" />
            <span>{en ? "Capability" : "Năng lực"}</span>
            <i aria-hidden="true" />
            <span>{en ? "Connection" : "Kết nối"}</span>
            <i aria-hidden="true" />
            <span>{en ? "Growth" : "Phát triển"}</span>
          </p>
          <div className="vabix-twin">
            {pillars.map((pillar, index) => (
              <Fragment key={pillar.id}>
                {index === 1 ? (
                  <p className="vabix-twin-bridge">
                    {en ? "Capability" : "Nội lực"} <span aria-hidden="true">↔</span> {en ? "Opportunity" : "Cơ hội"}
                  </p>
                ) : null}
                <article id={`tru-cot-${pillar.number}`} className={`vabix-twin-panel vabix-twin-panel-${pillar.tone}`}>
                  <span className="vabix-twin-watermark" aria-hidden="true">
                    {pillar.number}
                  </span>
                  <p className="vabix-twin-kicker">{en ? "Pillar" : "Trụ cột"} {pillar.number}</p>
                  <h3>{pillar.title}</h3>
                  <p className="vabix-twin-lead">{pillar.lead}</p>
                  <ul>
                    {pillar.items.map((item) => (
                      <li key={item.title} className="vabix-twin-row">
                        <span className="vabix-twin-index">{item.index}</span>
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.body}</p>
                        </div>
                        <ArrowIcon className="vabix-twin-arrow h-3.5 w-3.5" />
                      </li>
                    ))}
                  </ul>
                  <p className="vabix-twin-close">{pillar.close}</p>
                </article>
              </Fragment>
            ))}
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
            <p className="eyebrow">{en ? "About VABIX" : "Về VABIX"}</p>
            <h2>
              {en ? "A practical knowledge ecosystem" : "Hệ sinh thái tri thức thực chiến"}
              <span className="vabix-about-title-rest">{en ? " for growing businesses" : " và phát triển doanh nghiệp"}</span>
            </h2>
            <p className="vabix-about-lead">
              {en
                ? "VABIX turns practical knowledge into the capacity to act, working with business owners and their teams on training, transformation and partnerships built on trust."
                : "VABIX chuyển hóa tri thức thực chiến thành năng lực hành động, đồng hành cùng doanh chủ và đội ngũ trong đào tạo, chuyển đổi và kiến tạo những quan hệ hợp tác dựa trên niềm tin."}
            </p>
            <p className="vabix-about-note">{en ? "Every solution is built to be implemented, tested and valuable over time." : "Mỗi giải pháp đều hướng tới khả năng triển khai, kiểm chứng và tạo giá trị dài hạn."}</p>
            <Link href={href(paths.about)} className="vabix-about-cta">
              {en ? "More about VABIX" : "Hiểu thêm về VABIX"}
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="vabix-about-stage">
            <figure className="vabix-about-main">
              <Image
                src="/images/about/dao-tao-thuc-chien.jpg?v=3"
                alt={en ? "A VABIX expert working with business owners in a practical training session" : "Chuyên gia VABIX đồng hành cùng doanh chủ và đội ngũ trong buổi đào tạo thực chiến"}
                fill
                unoptimized
                sizes="(max-width: 1023px) 100vw, 62vw"
                className="object-cover"
              />
            </figure>
            <p className="vabix-about-caption">
              <span>{en ? "Practical knowledge" : "Tri thức thực chiến"}</span>
              <span className="vabix-about-caption-rule" aria-hidden="true" />
              <span>{en ? "Shared value" : "Kết nối giá trị"}</span>
            </p>
          </div>
        </Container>
      </section>

      <HomeReviews locale={locale} />

      <section className="vabix-programs" id="dao-tao">
        <div className="vabix-programs-bg" aria-hidden="true">
          <span className="vabix-programs-glow vabix-programs-glow-a" />
          <span className="vabix-programs-glow vabix-programs-glow-b" />
          <span className="vabix-programs-arc" />
        </div>
        <Container>
          <div className="vabix-programs-head">
            <div>
              <p className="eyebrow">{en ? "Training" : "Đào tạo & huấn luyện"}</p>
              <h2>{en ? "Programs for business owners" : "Các chương trình đào tạo doanh chủ"}</h2>
              <p className="vabix-programs-lead">
                {en
                  ? "Practical programs for business owners, CEOs and founders — from whole-business management and strategy to innovation and leadership."
                  : "Các chương trình thực chiến dành cho doanh chủ, CEO và nhà sáng lập — từ quản trị doanh nghiệp toàn diện, chiến lược, đổi mới sáng tạo đến năng lực lãnh đạo."}
              </p>
            </div>
            <Link href={href(paths.training)} className="vabix-programs-all">
              {en ? "View all programs" : "Xem tất cả chương trình"}
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="vabix-program-grid">
            {programs.map((program) => {
              const featured = "featured" in program && program.featured;
              return (
                <Link key={program.slug} href={href(paths.program(program.slug))} className={featured ? "vabix-program-feature" : "vabix-program-card"}>
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
            <Link href={href(paths.training)} className="vabix-program-more">
              <span className="vabix-program-more-arc" aria-hidden="true" />
              <p className="vabix-program-kicker">{en ? "The VABIX training system" : "Hệ đào tạo VABIX"}</p>
              <h3>{en ? "Explore the full program range" : "Khám phá toàn bộ chương trình"}</h3>
              <p className="vabix-program-desc">{en ? "Find a program that fits the stage of the business and the problem in front of it." : "Tìm chương trình phù hợp với giai đoạn phát triển và bài toán của doanh nghiệp."}</p>
              <span className="vabix-program-cta">
                {en ? "View all" : "Xem tất cả"}
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
            title={en ? "Consulting that stays through the change" : "Tư vấn & đồng hành chuyển đổi doanh nghiệp"}
            description={en ? "From diagnosing the current state to setting priorities, implementing, measuring and improving." : "Đồng hành từ chẩn đoán hiện trạng, xác định ưu tiên đến triển khai, đo lường và cải tiến."}
          />
          <div className="vabix-xform">
            <div className="vabix-xform-line" aria-hidden="true">
              <span className="vabix-xform-progress" />
              <span className="vabix-xform-led" />
            </div>
            <ol className="vabix-xform-steps">
              {steps.map((step) => (
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
            <p className="vabix-xform-out-label">{en ? "What the work produces" : "Đầu ra của quá trình chuyển đổi"}</p>
            <p className="vabix-xform-out-list">
              {outputs.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
          </div>
          <Link href={href(paths.consulting)} className="vabix-xform-cta">
            {en ? "Start a business assessment" : "Bắt đầu đánh giá doanh nghiệp"} <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </Container>
      </section>

      <section className="vabix-trust" id="trustworking">
        <Container>
          <header className="vabix-trust-head">
            <p className="eyebrow">Trustworking</p>
            <h2>{en ? "The right partners" : "Kết nối đối tác"}</h2>
            <p className="vabix-trust-sub">{en ? "The right partner · The right need · Shared value" : "Đúng đối tác · Đúng nhu cầu · Cộng hưởng giá trị"}</p>
          </header>

          <div className="vabix-trust-grid">
            <div className="vabix-trust-copy">
              <p>
                {en
                  ? "VABIX connects a company with strategic partners, suppliers, distributors, and delivery teams based on a real need, complementary strength, and trust — toward partnerships that can be carried out and keep creating value."
                  : "VABIX kết nối doanh nghiệp với đối tác chiến lược, nhà cung cấp, nhà phân phối và đơn vị triển khai dựa trên nhu cầu thực tế, khả năng bổ trợ và nền tảng niềm tin — hướng tới những quan hệ hợp tác có thể triển khai và tạo giá trị lâu dài."}
              </p>
              <ol className="vabix-trust-principles">
                <li>
                  <span>01</span>
                  <strong>{en ? "A fitting capability" : "Năng lực phù hợp"}</strong>
                </li>
                <li>
                  <span>02</span>
                  <strong>{en ? "Shared values" : "Giá trị tương đồng"}</strong>
                </li>
                <li>
                  <span>03</span>
                  <strong>{en ? "A will to stay the course" : "Thiện chí đồng hành"}</strong>
                </li>
              </ol>
              <Link href={href(`${paths.trustworking}#ket-noi`)} className="vabix-trust-cta">
                {en ? "Send a partner request" : "Gửi nhu cầu kết nối đối tác"}
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            <figure className="vabix-trust-visual" aria-label={en ? "Trustworking journey: a real need, a fitting connection, shared value." : "Trustworking journey: nhu cầu thực tế, kết nối phù hợp, cộng hưởng giá trị."}>
              <div className="vabix-trust-emblem">
                <Image
                  src="/brand/trustworking-mark.png"
                  alt="Trustworking — Beyond networking, building trust"
                  width={1024}
                  height={1024}
                />
              </div>
              <p className="vabix-trust-journey">Trustworking journey</p>
              <ol className="vabix-trust-flow">
                <li className="vabix-trust-step">
                  <p className="vabix-trust-num">01</p>
                  <div className="vabix-trust-rail" aria-hidden="true">
                    <span className="vabix-trust-mark" />
                  </div>
                  <div className="vabix-trust-body">
                    <h3>{en ? "A real need" : "Nhu cầu thực tế"}</h3>
                    <p>{en ? "Make clear what the business needs and what the partnership is for." : "Làm rõ doanh nghiệp đang cần gì và mục tiêu hợp tác."}</p>
                  </div>
                </li>
                <li className="vabix-trust-step">
                  <p className="vabix-trust-num">02</p>
                  <div className="vabix-trust-rail" aria-hidden="true">
                    <span className="vabix-trust-mark" />
                  </div>
                  <div className="vabix-trust-body">
                    <h3>{en ? "A fitting connection" : "Kết nối phù hợp"}</h3>
                    <p>{en ? "Choose partners by complementary strength, values, and the terms of working together." : "Chọn lọc đối tác dựa trên khả năng bổ trợ, giá trị và điều kiện hợp tác."}</p>
                    <p className="vabix-trust-types">
                      <span>{en ? "Strategic partners" : "Đối tác chiến lược"}</span>
                      <span>{en ? "Suppliers" : "Nhà cung cấp"}</span>
                      <span>{en ? "Distributors" : "Nhà phân phối"}</span>
                      <span>{en ? "Delivery teams" : "Đơn vị triển khai"}</span>
                    </p>
                  </div>
                </li>
                <li className="vabix-trust-step">
                  <p className="vabix-trust-num">03</p>
                  <div className="vabix-trust-rail" aria-hidden="true">
                    <span className="vabix-trust-mark" />
                  </div>
                  <div className="vabix-trust-body">
                    <h3>{en ? "Shared value" : "Cộng hưởng giá trị"}</h3>
                    <p>{en ? "Aim for a partnership that can be carried out and can last." : "Hướng tới quan hệ hợp tác có thể triển khai và phát triển lâu dài."}</p>
                  </div>
                </li>
              </ol>
            </figure>
          </div>
        </Container>
      </section>

      <section className="vabix-know" id="mo-hinh">
        <Container>
          <div className="vabix-know-top">
            <div className="vabix-know-copy">
              <p className="eyebrow">{en ? "Vietnamese practical philosophy" : "Triết nghiệm Việt"}</p>
              <h2>{en ? "The VABIX knowledge base" : "Nền tảng tri thức VABIX"}</h2>
              <p className="vabix-know-tag">{en ? "Knowledge shaped by Vietnamese practitioners · From practice in Vietnam · Toward value that can travel" : "Tri thức do người Việt kiến tạo · Từ thực tiễn Việt Nam · Hướng đến giá trị toàn cầu"}</p>
              <p>
                {en
                  ? "VABIX is building “Triết nghiệm Việt” — practical knowledge formed by reflection, experience, structure, and proof in the field."
                  : "VABIX theo đuổi khát vọng xây dựng “Triết nghiệm Việt” — một nền tri thức thực chiến được hình thành từ suy ngẫm, trải nghiệm, hệ thống hóa và kiểm chứng trong thực tiễn."}
              </p>
              <p>
                {en
                  ? "From The BizCar, APPLIER and MAIS to KAROT, KLASS, BABOSO, 3W and DGH, each model shares one aim: turn knowledge into the capacity to act and into results that can be seen."
                  : "Từ The BizCar, APPLIER, MAIS đến KAROT, KLASS, BABOSO, 3W và DGH, mỗi mô hình đều hướng đến một mục tiêu chung: chuyển hóa tri thức thành năng lực hành động và kết quả thực tiễn."}
              </p>
              <Link href={href(paths.methods)} className="vabix-know-cta">
                {en ? "Explore the VABIX knowledge base" : "Khám phá nền tảng tri thức VABIX"}
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            <figure className="vabix-know-map" aria-label={en ? "VABIX knowledge architecture: eight models on one knowledge base." : "Kiến trúc tri thức VABIX: tám mô hình cùng thuộc nền tảng VABIX Knowledge."}>
              <p className="vabix-know-kicker">VABIX Knowledge Architecture</p>
              <div className="vabix-know-field">
                <svg className="vabix-know-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {models.map((model) => (
                    <line key={model.slug} className="vabix-know-line" data-model={model.slug} x1="50" y1="50" x2={model.x} y2={model.y} />
                  ))}
                </svg>
                <div className="vabix-know-core">
                  <span>VABIX</span>
                  <strong>Knowledge</strong>
                </div>
                <div className="vabix-know-nodes" aria-hidden="true">
                  {models.map((model, index) => (
                    <span key={model.slug} className="vabix-know-node" data-model={model.slug} style={{ left: `${model.x}%`, top: `${model.y}%`, ["--i" as string]: index }}>
                      <span className="vabix-know-dot" />
                      {model.name}
                    </span>
                  ))}
                </div>
              </div>
            </figure>
          </div>

          <div className="vabix-know-directory">
            <p className="eyebrow">{en ? "Models and methods" : "Các mô hình & phương pháp"}</p>
            <ol className="vabix-know-list">
              {models.map((model) => (
                <li key={model.slug}>
                  <Link href={href(paths.method(model.slug))} className="vabix-know-item" data-model={model.slug}>
                    <span className="vabix-know-index">{model.index}</span>
                    <strong>{model.name}</strong>
                    <span className="vabix-know-line-copy">{model.line}</span>
                    <ArrowIcon className="vabix-know-arrow" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="vabix-founder" id="nha-sang-lap">
        <header className="vabix-founder-head">
          <p className="eyebrow">{en ? "A note from the founder" : "Thông điệp từ nhà sáng lập"}</p>
          <h2>
            {en ? "Build capability" : "Kiến tạo nội lực"} <span>–</span> {en ? "Widen connection" : "Mở rộng kết nối"} <span>–</span> {en ? "Grow with care" : "Phát triển bền vững"}
          </h2>
        </header>
        <Container>
          <div className="vabix-founder-grid">
            <div className="vabix-founder-copy">
              <p className="vabix-founder-intro">{en ? "Every business begins with an ambition." : "Mỗi doanh nghiệp đều bắt đầu từ một khát vọng."}</p>
              <p>
                {en
                  ? "After years beside business owners and CEOs, I have found that the larger difficulty is not a lack of knowledge. It is the ability to turn knowledge into action, to grow a team that can mature, and to find relationships trustworthy enough to build on."
                  : "Trong nhiều năm đồng hành cùng doanh chủ và CEO, tôi nhận thấy thách thức lớn không nằm ở việc thiếu kiến thức, mà ở khả năng chuyển hóa tri thức thành hành động, xây dựng một đội ngũ trưởng thành và tìm được những mối quan hệ đủ tin cậy để cùng phát triển."}
              </p>
              <p>
                {en
                  ? "VABIX grew from that concern — with two cores, Knowledge and Business — so a company can strengthen itself and open opportunity on a foundation of trust."
                  : "VABIX được hình thành từ chính những trăn trở ấy — với hai lõi Kết nối tri thức và Kết nối kinh doanh, giúp doanh nghiệp vừa nâng cao nội lực, vừa mở rộng cơ hội trên nền tảng của niềm tin."}
              </p>
              <blockquote className="vabix-founder-quote">
                <p>{en
                  ? "“I believe a business does not have to stand alone when knowledge becomes action, people grow together, and relationships are built on trust.”"
                  : "“Tôi tin rằng doanh nghiệp sẽ không phải đơn độc khi tri thức được chuyển hóa thành hành động, con người cùng trưởng thành và những mối quan hệ được kiến tạo trên nền tảng của niềm tin.”"}</p>
              </blockquote>
              <Link href={href(paths.founderMessage)} className="vabix-founder-cta">
                {en ? "Read the full letter" : "Đọc toàn bộ thông điệp"}
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            <figure className="vabix-founder-portrait">
              <div className="vabix-founder-frame">
                <Image
                  src="/images/portraits/nguyen-chi-thanh.jpg"
                  alt={en ? "Nguyễn Chí Thành, founder of VABIX" : "Nguyễn Chí Thành, nhà sáng lập VABIX"}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                  sizes="(min-width: 1024px) 32rem, min(100vw, 32rem)"
                />
              </div>
              <figcaption>
                <strong>{siteConfig.founder.name}</strong>
                <span>{ui.founderRole}</span>
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <section className="vabix-share" id="goc-chia-se">
        <Container>
          <SectionHeading title={en ? "Field notes" : "Góc chia sẻ"} description={en ? "Latest writing from the VABIX knowledge ecosystem." : "Bài viết mới nhất từ hệ sinh thái tri thức VABIX."} />
          <div className="vabix-share-grid">
            {featuredArticles.map((a) => (
              <ArticleCard key={a.id} article={a} hrefPrefix={en ? "/en" : ""} />
            ))}
          </div>
          <Link href={href(paths.insights)} className="vabix-share-more">
            {en ? "Read the field notes" : "Xem góc chia sẻ"} <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="vabix-close" id="bat-dau">
        <div className="vabix-close-decor" aria-hidden="true" />
        <Container>
          <p className="vabix-close-eyebrow">{en ? "Start with the right problem" : "Bắt đầu từ đúng vấn đề"}</p>
          <h2>{en ? "A business does not need to change everything. It needs to start in the right place." : "Doanh nghiệp không cần thay đổi mọi thứ. Chỉ cần bắt đầu đúng chỗ."}</h2>
          <p className="vabix-close-body">
            {en
              ? "Every business has its own condition and its own problem. VABIX starts by listening, so you can see what deserves priority, which capability is missing, and what kind of partnership fits — and so each effort points toward a change that can be seen."
              : "Mỗi doanh nghiệp có một trạng thái và một bài toán riêng. VABIX bắt đầu bằng việc lắng nghe, cùng bạn nhìn rõ điều cần ưu tiên, xác định năng lực cần bổ sung và lựa chọn cách đồng hành phù hợp — để mỗi nỗ lực đều hướng đến một thay đổi có thể nhìn thấy."}
          </p>
          <div className="vabix-close-actions">
            <Link href={href(paths.consult)} className="vabix-close-primary">
              {en ? "Share the problem you are facing" : "Chia sẻ bài toán của bạn"}
            </Link>
            <Link href={href("/giai-phap")} className="vabix-close-secondary">
              {en ? "See how VABIX works with you" : "Khám phá cách VABIX đồng hành"}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
