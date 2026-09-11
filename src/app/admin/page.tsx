import { requireMenu } from "@/platform/auth/guard";
import { getDb } from "@/platform/db/client";
import { processDueNotifications } from "@/platform/notify/service";
import { EmptyState } from "@/platform/ui/Shell";
import { formatDateTime } from "@/platform/time";
import Link from "next/link";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminHome() {
  await requireMenu("/admin");
  processDueNotifications();
  const db = getDb();
  const inquiries = (db.prepare(`SELECT COUNT(*) AS n FROM inquiries WHERE status IN ('new','processing')`).get() as { n: number }).n;
  const pendingCms = (db.prepare(`SELECT COUNT(*) AS n FROM cms_documents WHERE status='pending_review'`).get() as { n: number }).n;
  const classes = (db.prepare(`SELECT COUNT(*) AS n FROM lms_classes WHERE status IN ('in_progress','upcoming')`).get() as { n: number }).n;
  const grading = (
    db.prepare(
      `SELECT COUNT(*) AS n FROM lms_submissions s LEFT JOIN lms_grades g ON g.submission_id=s.id AND g.status='published' WHERE s.status='submitted' AND g.id IS NULL`,
    ).get() as { n: number }
  ).n;
  const overdueTasks = (
    db.prepare(`SELECT COUNT(*) AS n FROM tasks WHERE due_on < date('now') AND status NOT IN ('done','cancelled')`).get() as { n: number }
  ).n;
  const certs = (db.prepare(`SELECT COUNT(*) AS n FROM lms_certificates WHERE status='pending'`).get() as { n: number }).n;
  const upcoming = db
    .prepare(`SELECT title, starts_at FROM lms_schedules WHERE starts_at >= datetime('now') ORDER BY starts_at LIMIT 5`)
    .all() as { title: string; starts_at: string }[];

  const cards = [
    { label: "Yêu cầu chưa xử lý", value: inquiries, href: "/admin/ket-noi/tu-van", def: "Hồ sơ đăng ký/tư vấn ở trạng thái mới hoặc đang xử lý." },
    { label: "Nội dung chờ duyệt", value: pendingCms, href: "/admin/website/trang", def: "Bản ghi CMS ở trạng thái chờ duyệt." },
    { label: "Lớp đang hoạt động", value: classes, href: "/admin/dao-tao/lop", def: "Lớp sắp học hoặc đang học." },
    { label: "Bài cần chấm", value: grading, href: "/admin/dao-tao/bai-tap", def: "Bài nộp đã gửi, chưa có điểm công bố." },
    { label: "Task quá hạn", value: overdueTasks, href: "/admin/cong-viec", def: "Hạn đã qua và chưa hoàn thành/hủy." },
    { label: "Chứng nhận chờ duyệt", value: certs, href: "/admin/dao-tao/chung-nhan", def: "Hồ sơ chứng nhận pending." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#163c3e]">Tổng quan vận hành</h1>
        <p className="mt-1 text-sm text-[#66746f]">Số liệu lấy trực tiếp từ cơ sở dữ liệu. Không dùng số 0 để thay cho dữ liệu chưa có — 0 nghĩa là chưa có bản ghi.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="platform-card p-5 hover:border-[#dea443]">
            <p className="text-sm text-[#66746f]">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#163c3e]">{card.value}</p>
            <p className="mt-2 text-xs text-[#66746f]">{card.def}</p>
          </Link>
        ))}
      </div>
      {upcoming.length ? (
        <section className="platform-card p-5">
          <h2 className="font-semibold text-[#163c3e]">Lịch gần nhất</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {upcoming.map((item) => (
              <li key={item.starts_at + item.title}>
                {formatDateTime(item.starts_at)} — {item.title}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <EmptyState title="Chưa có buổi học sắp tới" body="Khi lớp có lịch, buổi học sẽ hiện tại đây." />
      )}
    </div>
  );
}
