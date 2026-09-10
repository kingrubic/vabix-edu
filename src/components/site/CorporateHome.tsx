import Link from "next/link";
import { proofSignals } from "@/content/metrics";
import { pillars, supportingLayers } from "@/content/pillars";
import { painPoints } from "@/content/about";
import {
  heroHeadline,
  heroSubheadline,
  supportingMessage,
  tagline,
  valueJourney,
} from "@/content/brand";
import { featuredPrograms } from "@/content/programs";
import { threeW } from "@/content/threeW";
import { consultingProcess } from "@/content/consulting";
import { trustworking } from "@/content/trustworking";
import { caseStudies } from "@/content/caseStudies";
import { featuredExperts } from "@/content/experts";
import { upcomingEvents } from "@/content/events";
import { articlesByCategory, articleCategories } from "@/content/articles";
import { partners } from "@/content/network";
import { Button } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ArrowIcon, JsonLd } from "@/components/ui/Misc";
import { CaseStudyCard, EventCard, ArticleCard, PartnerLogo, MetricCard, ExpertCard } from "@/components/cards/Cards";
import { CTASection } from "@/components/sections/CTASection";
import { breadcrumbJsonLd } from "@/lib/seo";

export function CorporateHome() {
  const featuredCases = caseStudies.filter((c) => c.featured).slice(0, 3);
  const featuredArticles = articlesByCategory().slice(0, 3);
  const homeEvents = upcomingEvents().slice(0, 3);
  const [line1, line2] = heroHeadline.split("\n");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", path: "/" }])} />
      <section className="relative overflow-hidden bg-vabix-deep-teal pt-28 text-white sm:pt-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-[480px] w-[480px] bg-[radial-gradient(circle,rgba(222,164,67,0.12),transparent_60%)]" />
        </div>
        <Container className="relative pb-16">
          <p className="eyebrow">{tagline}</p>
          <h1 className="mt-4 max-w-5xl text-balance text-[32px] font-semibold leading-[1.15] sm:text-[46px] lg:text-[clamp(44px,4.6vw,64px)]">
            {line1}
            <br />
            {line2}
          </h1>
          <p className="measure mt-6 text-base text-white/80 sm:text-lg">{heroSubheadline}</p>
          <p className="mt-4 text-sm text-vabix-soft-gold">{supportingMessage.join(" ")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/ket-noi#tu-van" variant="gold">
              Trao đổi nhu cầu doanh nghiệp
            </Button>
            <Button href="/giai-phap" variant="outline" className="border-white/40 text-white">
              Khám phá 3 mũi nhọn
            </Button>
          </div>
        </Container>
        <div className="border-t border-white/10">
          <Container className="grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
            {proofSignals.map((m) => (
              <MetricCard key={m.id} value={m.value} label={m.label} />
            ))}
          </Container>
        </div>
      </section>

      <section className="py-20" id="ba-mui-nhon">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Ba mũi nhọn 3T"
            title="Đào tạo. Chuyển đổi. Kết nối dựa trên niềm tin."
            description="3T là cấu trúc dịch vụ chính của VABIX. Kết nối tri thức và kết nối kinh doanh là triết lý thương hiệu — không thay thế 3T."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.id} className="flex h-full flex-col border border-vabix-deep-teal/10 bg-white p-8">
                <p className="text-sm font-semibold tracking-widest text-vabix-gold">{p.number} · {p.en}</p>
                <h3 className="mt-3 text-2xl font-semibold text-vabix-deep-teal">{p.vi}</h3>
                <p className="mt-4 text-sm text-vabix-muted">{p.problem}</p>
                <p className="mt-4 text-vabix-ink">{p.value}</p>
                <ul className="mt-6 space-y-2 text-sm font-medium text-vabix-deep-teal">
                  {p.services.slice(0, 4).map((s) => (
                    <li key={s.href + s.label}>
                      <Link href={s.href}>{s.label}</Link>
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-vabix-deep-teal">
                  {p.cta.label} <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20" id="hanh-trinh-gia-tri">
        <Container>
          <SectionHeading
            title="VABIX tạo giá trị như thế nào?"
            description="Đây là hành trình giá trị — không phải quy trình tuyến tính bắt buộc cho mọi khách hàng. Doanh nghiệp có thể bắt đầu từ đào tạo, tư vấn hoặc kết nối tùy bài toán."
          />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {valueJourney.map((s, i) => (
              <li key={s.step} className="border-t border-vabix-gold pt-5">
                <p className="text-sm font-semibold tracking-widest text-vabix-gold">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-lg font-semibold text-vabix-deep-teal">{s.step}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <p className="font-semibold text-vabix-deep-teal">Doanh nghiệp của bạn đang gặp bài toán nào?</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {painPoints.map((p) => (
                <li key={p} className="bg-white p-4 text-sm text-vabix-deep-teal">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-20" id="chuong-trinh">
        <Container>
          <SectionHeading
            eyebrow="Chương trình tiêu biểu"
            title="Thao trường thực chiến cho doanh chủ và đội ngũ"
            description="BMDO 30 buổi. MBM 12 tháng. Các chương trình khác: thời lượng được thiết kế theo nhu cầu — không tự đặt số buổi."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredPrograms()
              .filter((p) => ["bmdo", "mbm", "thao-truong-khoi-nghiep", "nang-luc-so-ai-lanh-dao", "ung-dung-ai-hieu-suat", "dao-tao-theo-yeu-cau"].includes(p.slug))
              .map((p) => (
                <Link key={p.slug} href={`/chuong-trinh/${p.slug}`} className="flex h-full flex-col border border-vabix-deep-teal/10 bg-white p-6 hover:border-vabix-gold">
                  <p className="eyebrow">{p.shortTitle}</p>
                  <h3 className="mt-2 text-lg font-semibold text-vabix-deep-teal">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm text-vabix-muted">{p.audience}</p>
                  <p className="mt-4 text-sm font-semibold text-vabix-gold">{p.duration ?? p.durationNote}</p>
                </Link>
              ))}
          </div>
          <Link href="/chuong-trinh" className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Xem danh mục chương trình <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="bg-vabix-deep-teal py-20 text-white" id="phuong-phap">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Mô hình nền tảng</p>
            <h2 className="mt-3 text-4xl font-semibold">The BizCar</h2>
            <p className="mt-2 text-xl text-vabix-soft-gold">12 khối chức năng. Một hệ thống thống nhất.</p>
            <p className="measure mt-5 text-white/80">
              BizCar là mô hình quản trị — không phải khóa học. BMDO là chương trình đào tạo CEO thực chiến. MBM là chương trình làm chủ mô hình. 3W là chuẩn thành công của quá trình học tập và thực thi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/mo-hinh-phuong-phap/bizcar" variant="gold">
                Khám phá BizCar
              </Button>
              <Button href="/mo-hinh-phuong-phap/mybizcar" variant="outline" className="border-white/40 text-white">
                MyBizCar
              </Button>
              <Button href="/bizcar/engine" variant="outline" className="border-white/40 text-white">
                Mở MyBizCar 3D
              </Button>
            </div>
          </div>
          <div>
            <p className="eyebrow">Chuẩn thành công 3W</p>
            <h2 className="mt-3 text-3xl font-semibold">{threeW.headline}</h2>
            <ul className="mt-8 space-y-5">
              {threeW.pillars.map((w) => (
                <li key={w.key} className="border-t border-vabix-gold/40 pt-4">
                  <p className="text-sm font-semibold tracking-widest text-vabix-gold">{w.key} — {w.title}</p>
                  <p className="mt-2 text-white/80">{w.body}</p>
                  <p className="mt-2 text-sm text-vabix-soft-gold">{w.outputs.join(" · ")}</p>
                </li>
              ))}
            </ul>
            <Link href="/mo-hinh-phuong-phap/3w" className="mt-6 inline-block text-vabix-gold">
              Xem khung đánh giá 3W
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20" id="tu-van-chuyen-doi">
        <Container>
          <SectionHeading
            eyebrow="Transformation"
            title="Tư vấn chuyển đổi doanh nghiệp"
            description="Đồng hành từ đánh giá hiện trạng đến đo lường cải tiến. Mười hai nhóm dịch vụ, một quy trình năm bước."
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
          <Link href="/giai-phap/tu-van-chuyen-doi" className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Xem 12 dịch vụ tư vấn <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20" id="trustworking">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Trustworking</p>
            <h2 className="mt-3 text-3xl font-semibold text-vabix-deep-teal sm:text-4xl">{trustworking.headline}</h2>
            <p className="measure mt-4 text-vabix-muted">{trustworking.summary}</p>
            <p className="measure mt-4 text-vabix-ink">{trustworking.screening}</p>
            <ul className="mt-6 space-y-2 text-sm text-vabix-muted">
              {trustworking.notNetworking.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/giai-phap/trustworking" variant="teal">
                Tìm hiểu Trustworking
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="bg-white p-6">
              <h3 className="font-semibold text-vabix-deep-teal">Cho nhà cung cấp</h3>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-vabix-muted">
                {trustworking.supplierValue.slice(0, 3).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </article>
            <article className="bg-white p-6">
              <h3 className="font-semibold text-vabix-deep-teal">Cho khách hàng / đối tác</h3>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-vabix-muted">
                {trustworking.buyerValue.slice(0, 3).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            title="Lớp năng lực hỗ trợ"
            description="Sản phẩm tri thức và nhân lực mở / nhân lực số xuyên suốt hệ sinh thái — không phải trụ cột thứ tư."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {supportingLayers.map((l) => (
              <Link key={l.href} href={l.href} className="border border-vabix-deep-teal/10 p-7 hover:border-vabix-gold">
                <h3 className="text-xl font-semibold text-vabix-deep-teal">{l.title}</h3>
                <p className="mt-3 text-sm text-vabix-muted">{l.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20">
        <Container>
          <SectionHeading
            title="Bài toán. Phương pháp. Đầu ra."
            description="Case study được giữ từ hồ sơ năng lực hiện có. Số liệu định lượng và phạm vi hợp đồng cần Founder xác nhận trước khi dùng như thành tích pháp nhân."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredCases.map((c) => (
              <CaseStudyCard key={c.id} item={c} />
            ))}
          </div>
          <Link href="/tri-thuc/case-study" className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Xem case study <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            title="Đội ngũ chuyên gia"
            description="Hồ sơ chuyên gia được giữ từ dữ liệu hiện có. Chức danh và học vị cần đối chiếu khi cập nhật."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredExperts.map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
          <Link href="/mang-luoi/chuyen-gia" className="mt-8 inline-flex items-center gap-2 font-semibold text-vabix-deep-teal">
            Mạng lưới chuyên gia <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="bg-vabix-ivory py-20">
        <Container>
          <SectionHeading title="Sự kiện & tri thức" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {homeEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {articleCategories.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/tri-thuc?chuyen-muc=${c.id}`} className="border border-vabix-deep-teal/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-vabix-deep-teal uppercase">
                {c.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <p className="eyebrow mb-3 text-center">Tổ chức xuất hiện trong hồ sơ năng lực</p>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-vabix-muted">
            Việc xuất hiện tên tổ chức không đồng nghĩa hợp đồng hiện tại, quan hệ đối tác đang hiệu lực hoặc được phép dùng làm chứng nhận khách hàng. Danh sách chờ Founder xác nhận phạm vi công bố.
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => (
              <PartnerLogo key={p.id} name={p.name} caption={p.caption} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Bắt đầu từ bài toán thực tế của doanh nghiệp bạn."
        description="VABIX đồng hành từ nhu cầu thật — đào tạo, chuyển đổi hoặc Trustworking — đánh giá bằng bằng chứng, không chạy theo hình thức."
        primary={{ label: "Trao đổi nhu cầu doanh nghiệp", href: "/ket-noi#tu-van" }}
        secondary={{ label: "Khám phá 3 mũi nhọn", href: "/giai-phap" }}
      />
    </>
  );
}
