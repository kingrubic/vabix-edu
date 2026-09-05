import Link from "next/link";
import { metrics } from "@/content/metrics";
import { solutions } from "@/content/solutions";
import { painPoints, methodologySteps } from "@/content/about";
import { caseStudies } from "@/content/caseStudies";
import { featuredExperts } from "@/content/experts";
import { upcomingEvents } from "@/content/events";
import { articlesByCategory } from "@/content/articles";
import { partners } from "@/content/network";
import { articleCategories } from "@/content/articles";
import { Button } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ArrowIcon, JsonLd } from "@/components/ui/Misc";
import { CaseStudyCard, EventCard, ArticleCard, PartnerLogo, MetricCard, SolutionCard, ExpertCard } from "@/components/cards/Cards";
import { CTASection } from "@/components/sections/CTASection";
import { OrbitalHero, NetworkGraph } from "@/components/visuals/Network";
import { Emblem } from "@/components/brand/Logo";
import { breadcrumbJsonLd } from "@/lib/seo";

export function CorporateHome() {
  const featuredCases = caseStudies.filter((c) => c.featured).slice(0, 3);
  const featuredArticles = articlesByCategory().slice(0, 3);
  const homeEvents = upcomingEvents().slice(0, 3);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", path: "/" }])} />
      <section className="relative overflow-hidden bg-vabix-deep-teal pt-28 text-white sm:pt-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-[480px] w-[480px] bg-[radial-gradient(circle,rgba(222,164,67,0.12),transparent_60%)]" />
        </div>
        <Container className="relative grid items-center gap-10 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div>
            <p className="eyebrow">Làng kết nối tri thức & kinh doanh</p>
            <h1 className="mt-4 max-w-4xl text-balance text-[36px] font-semibold leading-[1.12] sm:text-[48px] lg:text-[clamp(48px,5vw,76px)]">
              Kiến tạo nội lực.
              <br />
              Mở rộng kết nối.
              <br />
              Phát triển bền vững.
            </h1>
            <p className="measure mt-6 text-base text-white/80 sm:text-lg">
              VABIX đồng hành cùng doanh nhân và doanh nghiệp nâng cao năng lực quản trị, thiết kế hệ thống vận hành và mở rộng mạng lưới hợp tác thông qua tri thức thực chiến.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/ve-vabix" variant="gold">
                Khám phá VABIX
              </Button>
              <Button href="/ket-noi#tu-van" variant="outline" className="border-white/40 text-white">
                Đăng ký tư vấn
              </Button>
            </div>
          </div>
          <OrbitalHero />
        </Container>
        <div className="border-t border-white/10">
          <Container className="grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
            {metrics.map((m) => (
              <MetricCard key={m.id} value={m.value} label={m.label} />
            ))}
          </Container>
        </div>
      </section>

      <section className="bg-vabix-ivory py-16">
        <Container>
          <p className="eyebrow mb-8 text-center">Được tin tưởng đồng hành cùng các tổ chức và doanh nghiệp</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => (
              <PartnerLogo key={p.id} name={p.name} caption={p.caption} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20" id="vabix-la-ai">
        <Container>
          <SectionHeading
            align="center"
            title="Kết tri thức. Nối giá trị."
            description="VABIX là Làng kết nối, nơi tri thức được chuyển hóa thành năng lực thực tiễn và các mối quan hệ hợp tác được kết nối thành giá trị bền vững."
          />
          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
            <article className="border border-vabix-deep-teal/10 bg-white p-8">
              <p className="text-sm font-semibold tracking-widest text-vabix-gold">01</p>
              <h3 className="mt-3 text-2xl font-semibold text-vabix-deep-teal">Kết nối tri thức</h3>
              <p className="mt-3 text-vabix-muted">Giúp doanh nghiệp xây dựng nội lực vững chắc thông qua tri thức thực chiến và trải nghiệm thực tế.</p>
              <ul className="mt-6 space-y-2 text-sm font-medium text-vabix-deep-teal">
                <li><Link href="/giai-phap/tu-van-chien-luoc">Tư vấn chiến lược</Link></li>
                <li><Link href="/giai-phap/dao-tao-doanh-nhan">Đào tạo doanh nhân</Link></li>
                <li><Link href="/giai-phap/huan-luyen-doanh-nghiep">Huấn luyện doanh nghiệp</Link></li>
              </ul>
            </article>
            <div className="hidden items-center justify-center lg:flex">
              <Emblem className="h-24 w-24" />
            </div>
            <article className="border border-vabix-gold/40 bg-white p-8">
              <p className="text-sm font-semibold tracking-widest text-vabix-gold">02</p>
              <h3 className="mt-3 text-2xl font-semibold text-vabix-deep-teal">Kết nối kinh doanh</h3>
              <p className="mt-3 text-vabix-muted">Mở rộng quan hệ, tiếp cận nguồn lực, đối tác và các cơ hội phát triển.</p>
              <ul className="mt-6 space-y-2 text-sm font-medium text-vabix-deep-teal">
                <li><Link href="/giai-phap/ket-noi-doanh-nghiep">Kết nối doanh nghiệp</Link></li>
                <li><Link href="/giai-phap/xuc-tien-thuong-mai">Xúc tiến thương mại</Link></li>
              </ul>
            </article>
          </div>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20">
        <Container>
          <SectionHeading eyebrow="Bài toán doanh nghiệp" title="Nhìn đúng bài toán. Tìm đúng lời giải." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((p, i) => (
              <article key={p} className="bg-white p-6">
                <p className="text-sm font-semibold tracking-widest text-vabix-gold">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-vabix-deep-teal">{p}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <p className="font-semibold text-vabix-deep-teal">Doanh nghiệp của bạn đang gặp bài toán nào?</p>
            <Link href="/ket-noi#tu-van" className="mt-2 inline-flex items-center gap-2 text-vabix-deep-teal">
              Trao đổi cùng chuyên gia VABIX <ArrowIcon />
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading title="Giải pháp được thiết kế từ bài toán thực tế" />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {solutions.filter((s) => s.slug !== "thiet-ke-van-hanh-doanh-nghiep").map((s) => (
              <SolutionCard key={s.id} number={s.number} title={s.title} summary={s.summary} href={`/giai-phap/${s.slug}`} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-vabix-deep-teal py-20 text-white">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">VABIX Signature Model</p>
            <h2 className="mt-3 text-4xl font-semibold">The BizCar</h2>
            <p className="mt-2 text-xl text-vabix-soft-gold">Thiết kế và vận hành doanh nghiệp toàn diện</p>
            <p className="measure mt-5 text-white/80">
              BizCar là khung tư duy giúp lãnh đạo nhìn doanh nghiệp như một hệ thống thống nhất, nhận diện đúng điểm nghẽn và thiết kế lại năng lực vận hành phù hợp với từng giai đoạn.
            </p>
            <ol className="mt-8 flex flex-wrap gap-4 text-sm font-semibold tracking-[0.16em]">
              {["SEE", "DESIGN", "ALIGN", "OPERATE"].map((s, i) => (
                <li key={s} className="flex items-center gap-4">
                  <span>{s}</span>
                  {i < 3 ? <span className="text-vabix-gold">↓</span> : null}
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/bizcar/engine" variant="gold">
                Mở MyBizCar 3D →
              </Button>
              <Button href="/mo-hinh-phuong-phap/bizcar" variant="outline" className="border-white/40 text-white">
                Khám phá The BizCar
              </Button>
            </div>
          </div>
          <div className="border border-vabix-gold/30 p-8">
            <p className="eyebrow">12 khối chức năng</p>
            <p className="mt-3 text-white/80">Định hướng & thị trường · Nguồn lực & vận hành · Lãnh đạo & tổ chức</p>
            <Link href="/mo-hinh-phuong-phap/bizcar" className="mt-6 inline-block text-vabix-gold">
              Xem mô hình đầy đủ
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading title="Từ nhận diện vấn đề đến chuyển giao năng lực" />
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {methodologySteps.map((s) => (
              <li key={s.n} className="border-t border-vabix-gold pt-5">
                <p className="text-sm font-semibold tracking-widest text-vabix-gold">{s.n}</p>
                <h3 className="mt-2 text-xl font-semibold text-vabix-deep-teal">{s.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20">
        <Container>
          <SectionHeading align="center" title="Nền tảng tri thức & phương pháp triển khai" />
          <div className="mt-12">
            <NetworkGraph />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading title="Đồng hành thực chiến. Kiến tạo giá trị thực tế." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredCases.map((c) => (
              <CaseStudyCard key={c.id} item={c} />
            ))}
          </div>
          <Link href="/tri-thuc/case-study" className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Xem các dự án tiêu biểu <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20">
        <Container>
          <SectionHeading
            title="Đội ngũ chuyên gia"
            description="VABIX quy tụ những chuyên gia đã trực tiếp nghiên cứu, điều hành, cố vấn và triển khai giải pháp trong môi trường doanh nghiệp."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredExperts.map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
          <Link href="/mang-luoi/chuyen-gia" className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Khám phá mạng lưới chuyên gia <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-vabix-teal py-20 text-white">
        <Container className="relative max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Mạng lưới không chỉ để kết nối. Mạng lưới phải tạo ra giá trị.
          </h2>
          <p className="measure mt-5 text-white/80">
            VABIX kết nối doanh nghiệp, chuyên gia, đối tác và nguồn lực phù hợp nhằm tạo ra cơ hội hợp tác có chiều sâu và giá trị bền vững.
          </p>
          <div className="mt-8">
            <Button href="/ket-noi" variant="gold">
              Kết nối cùng VABIX
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading title="Sự kiện & chương trình" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {homeEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
          <Link href="/su-kien" className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Xem tất cả sự kiện <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20">
        <Container>
          <SectionHeading title="Tri thức VABIX" />
          <div className="mt-6 flex flex-wrap gap-2">
            {articleCategories.slice(0, 8).map((c) => (
              <Link key={c.id} href={`/tri-thuc?chuyen-muc=${c.id}`} className="border border-vabix-deep-teal/15 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase text-vabix-deep-teal">
                {c.label}
              </Link>
            ))}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <Link href="/tri-thuc" className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Khám phá kho tri thức <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <p className="eyebrow mb-6 text-center">Đối tác & khách hàng</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => (
              <PartnerLogo key={`wall-${p.id}`} name={p.name} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Một hành trình phát triển đúng bắt đầu từ việc nhìn đúng bài toán."
        description="Kết nối cùng VABIX để cùng xác định bước đi phù hợp cho doanh nghiệp của bạn."
      />
    </>
  );
}
