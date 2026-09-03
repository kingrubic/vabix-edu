import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { principles, vision, mission, founderQuote, founderMessage, journey, glossary, capabilities } from "@/content/about";
import { featuredExperts } from "@/content/experts";
import { partners } from "@/content/network";
import { ExpertCard, PartnerLogo } from "@/components/cards/Cards";
import { Button } from "@/components/ui/Button";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import Image from "next/image";

export const metadata = createMetadata({
  title: "Về VABIX",
  description: `VABIX là gì? ${siteConfig.description}`,
  path: "/ve-vabix",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Về VABIX"
        title="Làng kết nối tri thức & kinh doanh"
        description="VABIX không chỉ là trung tâm đào tạo, cũng không chỉ là sàn giao dịch. VABIX là nơi tri thức được chuyển hóa thành năng lực, và kết nối được chuyển hóa thành giá trị bền vững."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Về VABIX" }]}
      />

      <Container className="py-16">
        <h2 className="text-3xl font-semibold text-vabix-deep-teal">VABIX là ai?</h2>
        <p className="measure mt-4 text-lg text-vabix-muted">
          VABIX là Làng kết nối, nơi tri thức được chuyển hóa thành năng lực thực tiễn và các mối quan hệ hợp tác được kết nối thành giá trị bền vững. Chúng tôi đồng hành cùng doanh nhân và doanh nghiệp Việt Nam thông qua hai trụ cột: kết nối tri thức và kết nối kinh doanh.
        </p>
      </Container>

      <section id="tam-nhin" className="bg-vabix-ivory py-16">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">Tầm nhìn</p>
            <p className="mt-4 text-xl font-medium text-vabix-deep-teal">{vision}</p>
          </div>
          <div id="su-menh">
            <p className="eyebrow">Sứ mệnh</p>
            <p className="mt-4 text-xl font-medium text-vabix-deep-teal">{mission}</p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-3xl font-semibold text-vabix-deep-teal">Hai trụ cột</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="border border-vabix-deep-teal/10 p-8">
            <p className="eyebrow">Trụ cột 01</p>
            <h3 className="mt-2 text-2xl font-semibold text-vabix-deep-teal">Kết nối tri thức</h3>
            <p className="mt-3 text-vabix-muted">Tư vấn chiến lược, đào tạo doanh nhân, huấn luyện doanh nghiệp, thiết kế và vận hành doanh nghiệp.</p>
          </article>
          <article className="border border-vabix-gold/40 p-8">
            <p className="eyebrow">Trụ cột 02</p>
            <h3 className="mt-2 text-2xl font-semibold text-vabix-deep-teal">Kết nối kinh doanh</h3>
            <p className="mt-3 text-vabix-muted">Kết nối doanh nghiệp, xúc tiến thương mại, kết nối nguồn lực và phát triển mạng lưới hợp tác.</p>
          </article>
        </div>
      </Container>

      <section id="gia-tri" className="bg-vabix-deep-teal py-20 text-white">
        <Container>
          <p className="eyebrow">Sáu chữ vàng</p>
          <h2 className="mt-3 text-3xl font-semibold">Kim chỉ nam cho mọi hành động</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <article key={p.key} className="border border-white/10 p-6">
                <p className="text-2xl font-semibold text-vabix-gold">{p.key}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  {p.items.map((i) => (
                    <li key={i.title}>
                      <span className="font-semibold text-white">{i.title}.</span> {i.body}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Container className="grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Thông điệp nhà sáng lập</p>
          <blockquote className="mt-4 text-2xl font-medium text-vabix-deep-teal">“{founderQuote}”</blockquote>
          {founderMessage.map((p) => (
            <p key={p} className="measure mt-4 text-vabix-muted">
              {p}
            </p>
          ))}
          <p className="mt-6 font-semibold text-vabix-deep-teal">{siteConfig.founder.name}</p>
          <p className="text-sm text-vabix-muted">{siteConfig.founder.role}</p>
        </div>
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden bg-vabix-deep-teal">
          <Image src="/images/portraits/nguyen-chi-thanh.png" alt="Nguyễn Chí Thành, nhà sáng lập VABIX" fill className="object-cover object-top" sizes="400px" />
        </div>
      </Container>

      <section className="bg-vabix-ivory py-16">
        <Container>
          <h2 className="text-3xl font-semibold text-vabix-deep-teal">Hành trình phát triển</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {journey.map((j) => (
              <li key={j.year} className="border-t border-vabix-gold pt-4">
                <p className="text-sm font-semibold text-vabix-gold">{j.year}</p>
                <h3 className="mt-2 font-semibold text-vabix-deep-teal">{j.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{j.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-3xl font-semibold text-vabix-deep-teal">Hệ sinh thái VABIX</h2>
        <p className="measure mt-4 text-vabix-muted">
          Nền tảng phục vụ bốn nhân tố: khách hàng, nhà cung cấp, cư dân kết nối và đội ngũ VABIX — cùng các làng ngành, chuyên gia và đối tác.
        </p>
        <h3 className="mt-10 text-xl font-semibold text-vabix-deep-teal">Năng lực then chốt</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {capabilities.map((c) => (
            <li key={c} className="bg-vabix-ivory p-4 text-sm">
              {c}
            </li>
          ))}
        </ul>
      </Container>

      <section className="bg-vabix-ivory py-16">
        <Container>
          <h2 className="text-3xl font-semibold text-vabix-deep-teal">Mạng lưới chuyên gia</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {featuredExperts.slice(0, 6).map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-3xl font-semibold text-vabix-deep-teal">Đối tác</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <PartnerLogo key={p.id} name={p.name} caption={p.caption} />
          ))}
        </div>
      </Container>

      <section id="ho-so" className="bg-vabix-ivory py-16">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-vabix-deep-teal">Hồ sơ năng lực</h2>
            <p className="mt-2 text-vabix-muted">Ấn bản 2026 — Làng kết nối VABIX.</p>
          </div>
          <Button href="/ve-vabix#ho-so" variant="teal">
            Liên hệ để nhận hồ sơ
          </Button>
        </Container>
      </section>

      <section id="thuat-ngu" className="py-16">
        <Container>
          <h2 className="text-3xl font-semibold text-vabix-deep-teal">Thuật ngữ của Làng</h2>
          <dl className="mt-8 space-y-5">
            {glossary.map((g) => (
              <div key={g.term}>
                <dt className="font-semibold text-vabix-deep-teal">{g.term}</dt>
                <dd className="text-vabix-muted">{g.meaning}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <CTASection title="Kết nối đúng tri thức. Gặp gỡ đúng đối tác." description="VABIX sẵn sàng đồng hành từ việc nhìn đúng bài toán." />
    </>
  );
}
