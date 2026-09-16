import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { EventCard } from "@/components/cards/Cards";
import { publishedUpcomingEvents } from "@/platform/cms/catalog";
import { createMetadata } from "@/lib/seo";
import { paths } from "@/lib/paths";
import { LeadForm } from "@/components/forms/LeadForm";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Lịch học / Lớp đang mở",
  description: "Các lớp và sự kiện đào tạo VABIX. Lịch khai giảng chỉ hiển thị khi đã được xác nhận.",
  path: paths.programSchedule,
});

export default function TrainingSchedulePage() {
  const events = publishedUpcomingEvents().filter((item) => item.status !== "completed");
  return (
    <>
      <PageHero
        title="Lịch học / Lớp đang mở"
        description="Sự kiện và lớp được công bố khi đã có ngày, địa điểm và trạng thái đăng ký. Không tự tạo lịch khai giảng mới."
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Đào tạo", href: paths.training },
          { name: "Lịch học" },
        ]}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {events.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <p className="text-vabix-muted">
              Hiện chưa có lớp công bố trên website. Vui lòng để lại nhu cầu để VABIX liên hệ khi có lịch phù hợp.
            </p>
          )}
          <Link href={paths.events} className="mt-8 inline-block font-semibold text-vabix-deep-teal">
            Xem tất cả sự kiện
          </Link>
        </div>
        <div className="border border-vabix-deep-teal/10 bg-white p-6">
          <LeadForm type="training" title="Đăng ký nhận lịch lớp" />
        </div>
      </Container>
    </>
  );
}
