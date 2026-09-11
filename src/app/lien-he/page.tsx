import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { siteConfig } from "@/lib/siteConfig";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Liên hệ VABIX",
  description: `Liên hệ VABIX — ${siteConfig.contact.address}. Hotline ${siteConfig.contact.hotline}.`,
  path: "/lien-he",
});

export default function ContactPage() {
  const c = siteConfig.contact;
  return (
    <>
      <PageHero
        title="Liên hệ VABIX"
        description="Kết nối đúng tri thức. Gặp gỡ đúng đối tác. Kiến tạo giá trị bền vững."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Liên hệ" }]}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-vabix-deep-teal">{siteConfig.legalName}</h2>
          <address className="mt-4 space-y-2 not-italic text-vabix-muted">
            <p>{c.address}</p>
            <p>
              Hotline: <a href={c.hotlineHref}>{c.hotline}</a>
            </p>
            <p>
              Điện thoại văn phòng: <a href={c.officePhoneHref}>{c.officePhone}</a>
            </p>
            <p>
              Email: <span suppressHydrationWarning>{c.email}</span>
            </p>
            <p>
              Hỗ trợ: <span suppressHydrationWarning>{c.supportEmail}</span>
            </p>
          </address>
          <ul className="mt-6 space-y-1 text-sm">
            <li>
              <a href={siteConfig.social.facebook}>Facebook</a>
            </li>
            <li>
              <a href={siteConfig.social.linkedin}>LinkedIn</a>
            </li>
            <li>
              <a href={siteConfig.social.youtube}>YouTube</a>
            </li>
          </ul>
        </div>
        <div className="border border-vabix-deep-teal/10 p-6">
          <LeadForm type="consult" title="Gửi thông tin liên hệ" />
        </div>
      </Container>
    </>
  );
}
