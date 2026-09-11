import { notFound } from "next/navigation";
import { events } from "@/content/events";
import { publishedEvent, publishedEvents } from "@/platform/cms/catalog";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { JsonLd } from "@/components/ui/Misc";
import { createMetadata, absUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export function generateStaticParams() {
  const slugs = new Set(events.map((item) => item.slug));
  try {
    for (const item of publishedEvents()) slugs.add(item.slug);
  } catch {
    /* file fallback */
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = publishedEvent(slug);
  if (!e) return {};
  return createMetadata({ title: e.title, description: e.excerpt, path: `/su-kien/${e.slug}`, image: e.image });
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = publishedEvent(slug);
  if (!e) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: e.title,
          startDate: e.startDate,
          endDate: e.endDate ?? e.startDate,
          eventStatus:
            e.status === "upcoming"
              ? "https://schema.org/EventScheduled"
              : e.status === "completed"
                ? "https://schema.org/EventScheduled"
                : "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: e.location, address: siteConfig.contact.address },
          image: absUrl(e.image),
          description: e.excerpt,
          organizer: { "@type": "Organization", name: "VABIX" },
        }}
      />
      <PageHero
        eyebrow={e.category}
        title={e.title}
        description={e.excerpt}
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Sự kiện", href: "/su-kien" }, { name: e.title }]}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-sm text-vabix-gold">
            {new Date(e.startDate).toLocaleDateString("vi-VN")} · {e.location}
          </p>
          <p className="measure mt-6 text-vabix-muted">{e.content}</p>
        </div>
        {e.status !== "completed" ? (
          <div className="border border-vabix-deep-teal/10 p-6">
            <LeadForm type="event" eventSlug={e.slug} title="Đăng ký sự kiện" />
          </div>
        ) : null}
      </Container>
    </>
  );
}
