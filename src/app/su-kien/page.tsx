import { publishedUpcomingEvents } from "@/platform/cms/catalog";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { EventCard } from "@/components/cards/Cards";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Sự kiện VABIX",
  description: "Sự kiện kết nối, chương trình BMDO, workshop và đào tạo cư dân của VABIX.",
  path: "/su-kien",
});

export default function EventsPage() {
  const list = publishedUpcomingEvents().filter((e) => e.status !== "completed");
  return (
    <>
      <PageHero
        title="Sự kiện & chương trình"
        description="Ưu tiên các sự kiện sắp diễn ra. Sự kiện đã diễn ra được lưu tại kho lưu trữ."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Sự kiện" }]}
      />
      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {list.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
        <Link href="/su-kien/archive" className="mt-10 inline-block font-semibold text-vabix-deep-teal">
          Xem sự kiện đã diễn ra
        </Link>
      </Container>
    </>
  );
}
