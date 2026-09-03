import { testimonials } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Nhà cung cấp",
  description: "Gian hàng số của các nhà cung cấp trong Làng VABIX — kết nối cung cầu trên nền tảng có thẩm định.",
  path: "/mang-luoi/nha-cung-cap",
});

export default function SuppliersPage() {
  return (
    <>
      <PageHero
        title="Gian hàng nhà cung cấp"
        description="Không gian số của các nhà cung cấp trong Làng VABIX. Việc tham gia được thẩm định — không phải gian hàng tự do."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Mạng lưới", href: "/mang-luoi" }, { name: "Nhà cung cấp" }]}
      />
      <Container className="py-16">
        <p className="measure text-vabix-muted">
          Gian hàng số đang vận hành trên nền tảng hiện hữu của VABIX. Quý khách có thể tham quan, tìm hiểu năng lực nhà cung cấp và liên hệ kết nối.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={siteConfig.portals.marketplace} variant="teal">
            Vào gian hàng số
          </Button>
          <Button href="/mang-luoi/tro-thanh-doi-tac" variant="outline" className="border-vabix-deep-teal text-vabix-deep-teal">
            Trở thành nhà cung cấp
          </Button>
        </div>
        <h2 className="mt-14 text-2xl font-semibold text-vabix-deep-teal">Tiếng nói từ cộng đồng</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="border border-vabix-deep-teal/10 p-6">
              <p className="text-sm text-vabix-ink">“{t.quote}”</p>
              <footer className="mt-4 text-sm font-semibold text-vabix-deep-teal">
                {t.author} <span className="block font-normal text-vabix-muted">{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </>
  );
}
