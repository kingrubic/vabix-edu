import { requireMenu } from "@/platform/auth/guard";
import { listCms } from "@/platform/cms/service";
import { saveCmsForm } from "@/platform/ui/actions";
import Link from "next/link";

const TYPES: Record<string, { type: string; title: string; menu: string }> = {
  trang: { type: "page", title: "Trang và khối nội dung", menu: "/admin/website/trang" },
  menu: { type: "nav", title: "Menu / footer", menu: "/admin/website/menu" },
  "giai-phap": { type: "solution", title: "Giải pháp 3T", menu: "/admin/website/giai-phap" },
  "chuong-trinh": { type: "program", title: "Chương trình", menu: "/admin/website/chuong-trinh" },
  "mo-hinh": { type: "methodology", title: "Mô hình / phương pháp", menu: "/admin/website/mo-hinh" },
  "chuyen-gia": { type: "expert", title: "Chuyên gia", menu: "/admin/website/chuyen-gia" },
  "doi-tac": { type: "partner", title: "Đối tác / làng ngành", menu: "/admin/website/doi-tac" },
  "bai-viet": { type: "article", title: "Bài viết / case study", menu: "/admin/website/bai-viet" },
  "su-kien": { type: "event", title: "Sự kiện", menu: "/admin/website/su-kien" },
  "san-pham": { type: "knowledge_product", title: "Sản phẩm tri thức", menu: "/admin/website/san-pham" },
  "nhan-luc": { type: "workforce", title: "Nhân lực mở / nhân lực số", menu: "/admin/website/nhan-luc" },
  "thu-vien": { type: "knowledge_product", title: "Thư viện", menu: "/admin/website/thu-vien" },
  seo: { type: "redirect", title: "SEO / chuyển hướng", menu: "/admin/website/seo" },
};

export default async function CmsTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const meta = TYPES[type];
  if (!meta) return <p>Mục không hợp lệ.</p>;
  await requireMenu(meta.menu);
  const rows = listCms(meta.type, true);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">{meta.title}</h1>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead><tr><th>Tiêu đề</th><th>Slug</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.slug}</td>
                <td>{row.status}</td>
                <td><Link className="underline" href={`/admin/website/${type}/${row.id}`}>Sửa</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form action={saveCmsForm} className="platform-card grid gap-3 p-6">
        <input type="hidden" name="type" value={meta.type} />
        <label className="text-sm">Tiêu đề<input className="input mt-1" name="title" required /></label>
        <label className="text-sm">Slug<input className="input mt-1" name="slug" required /></label>
        <label className="text-sm">Nội dung (JSON payload)<textarea className="input mt-1 min-h-40 font-mono text-sm" name="payload" defaultValue="{}" /></label>
        <label className="text-sm">Ghi chú nội bộ<textarea className="input mt-1" name="internalNotes" /></label>
        <label className="text-sm">
          Trạng thái
          <select className="input mt-1" name="status" defaultValue="draft">
            <option value="draft">Nháp</option>
            <option value="pending_review">Chờ duyệt</option>
            <option value="published">Xuất bản</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </label>
        <button className="bg-[#163c3e] px-4 py-2 text-white">Tạo bản ghi</button>
      </form>
    </div>
  );
}
