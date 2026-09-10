import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { LeadForm } from "@/components/forms/LeadForm";
import { trustworking } from "@/content/trustworking";
import { villages } from "@/content/network";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Trustworking — Kết nối kinh doanh dựa trên niềm tin",
  description: trustworking.summary,
  path: "/giai-phap/trustworking",
});

export default function TrustworkingPage() {
  return (
    <>
      <PageHero
        eyebrow="Trustworking"
        title={trustworking.headline}
        description={trustworking.summary}
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Giải pháp", href: "/giai-phap" },
          { name: "Trustworking" },
        ]}
      />
      <Container className="py-16">
        <p className="max-w-3xl text-lg text-vabix-ink">{trustworking.screening}</p>
        <ul className="mt-6 space-y-2 text-vabix-muted">
          {trustworking.notNetworking.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Container>
      <section className="bg-vabix-ivory py-16">
        <Container className="grid gap-8 md:grid-cols-2">
          <article className="bg-white p-8">
            <h2 className="text-2xl font-semibold text-vabix-deep-teal">Giá trị cho nhà cung cấp</h2>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-vabix-ink">
              {trustworking.supplierValue.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
          <article className="bg-white p-8">
            <h2 className="text-2xl font-semibold text-vabix-deep-teal">Giá trị cho khách hàng / đối tác</h2>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-vabix-ink">
              {trustworking.buyerValue.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
        </Container>
      </section>
      <Container className="py-16">
        <SectionHeading title="Quy trình năm bước" />
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {trustworking.process.map((s) => (
            <li key={s.step} className="border-t border-vabix-gold pt-4">
              <p className="text-sm font-semibold text-vabix-gold">{s.step}</p>
              <h3 className="mt-1 font-semibold text-vabix-deep-teal">{s.title}</h3>
              <p className="mt-2 text-sm text-vabix-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
      <section className="bg-vabix-ivory py-16">
        <Container>
          <SectionHeading title="Nguyên tắc" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {trustworking.principles.map((x) => (
              <li key={x} className="bg-white p-4 text-vabix-deep-teal">
                {x}
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-xl font-semibold text-vabix-deep-teal">Giới hạn trách nhiệm</h3>
          <p className="measure mt-3 text-vabix-muted">{trustworking.limitation}</p>
        </Container>
      </section>
      <Container className="py-16">
        <SectionHeading title="Dịch vụ con" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trustworking.services.map((s) => (
            <Link key={s.href} href={s.href} className="border border-vabix-deep-teal/10 p-6 hover:border-vabix-gold">
              <h3 className="font-semibold text-vabix-deep-teal">{s.title}</h3>
              <p className="mt-2 text-sm text-vabix-muted">{s.body}</p>
            </Link>
          ))}
        </div>
        <h3 className="mt-12 text-xl font-semibold text-vabix-deep-teal">Làng ngành hiện có</h3>
        <p className="mt-2 text-sm text-vabix-muted">Dữ liệu mạng lưới được giữ và đặt trong Trustworking. Hồ sơ nhà cung cấp không đồng nghĩa chứng nhận pháp lý hay bảo đảm chất lượng tuyệt đối.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {villages.slice(0, 12).map((v) => (
            <Link key={v.slug} href={`/mang-luoi/lang-nganh/${v.slug}`} className="text-sm text-vabix-deep-teal hover:text-vabix-gold">
              {v.name}
            </Link>
          ))}
        </div>
        <Link href="/mang-luoi/lang-nganh" className="mt-4 inline-block text-sm font-semibold text-vabix-deep-teal">
          Xem tất cả làng ngành
        </Link>
      </Container>
      <section className="bg-vabix-ivory py-16" id="ket-noi">
        <Container>
          <SectionHeading title="Bắt đầu kết nối có chủ đích" />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {trustworking.ctas.map((c) => (
              <div key={c.id} id={c.id} className="border border-vabix-deep-teal/10 bg-white p-6">
                <LeadForm type={c.type} title={c.title} />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <CTASection title="Kết nối đúng, trên nền tảng niềm tin." description="Sàng lọc trước khi giới thiệu. Mỗi bên tự thẩm định và quyết định." />
    </>
  );
}
