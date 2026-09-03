import { events } from "@/content/events";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { EventCard } from "@/components/cards/Cards";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Lưu trữ sự kiện",
  description: "Các sự kiện VABIX đã diễn ra.",
  path: "/su-kien/archive",
});

export default function EventArchivePage() {
  const list = events.filter((e) => e.status === "completed");
  return (
    <>
      <PageHero
        title="Sự kiện đã diễn ra"
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Sự kiện", href: "/su-kien" }, { name: "Lưu trữ" }]}
      />
      <Container className="grid gap-6 py-16 md:grid-cols-3">
        {list.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </Container>
    </>
  );
}
