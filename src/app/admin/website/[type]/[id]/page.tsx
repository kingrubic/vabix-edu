import { notFound } from "next/navigation";
import { requireMenu } from "@/platform/auth/guard";
import { getCmsById } from "@/platform/cms/service";
import { saveCmsForm } from "@/platform/ui/actions";

export default async function CmsEditPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  await requireMenu(`/admin/website/${type}`);
  const doc = getCmsById(id);
  if (!doc) notFound();
  return (
    <form action={saveCmsForm} className="platform-card space-y-4 p-6">
      <input type="hidden" name="id" value={doc.id} />
      <input type="hidden" name="type" value={doc.type} />
      <input type="hidden" name="expectedVersion" value={doc.version} />
      <h1 className="text-2xl font-semibold text-[#163c3e]">Sửa: {doc.title}</h1>
      <label className="block text-sm">Tiêu đề<input className="input mt-1" name="title" defaultValue={doc.title} /></label>
      <label className="block text-sm">Slug<input className="input mt-1" name="slug" defaultValue={doc.slug} /></label>
      <label className="block text-sm">Payload JSON<textarea className="input mt-1 min-h-64 font-mono text-sm" name="payload" defaultValue={JSON.stringify(JSON.parse(doc.payload), null, 2)} /></label>
      <label className="block text-sm">SEO JSON<textarea className="input mt-1 font-mono text-sm" name="seo" defaultValue={doc.seo} /></label>
      <label className="block text-sm">Ghi chú nội bộ<textarea className="input mt-1" name="internalNotes" defaultValue={doc.internal_notes} /></label>
      <label className="block text-sm">
        Trạng thái
        <select className="input mt-1" name="status" defaultValue={doc.status}>
          <option value="draft">Nháp</option>
          <option value="pending_review">Chờ duyệt</option>
          <option value="published">Xuất bản</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </label>
      <p className="text-xs text-[#66746f]">Ghi chú nội bộ không xuất hiện trên website. Không chèn JavaScript. Phiên bản hiện tại: {doc.version}.</p>
      <button className="bg-[#163c3e] px-4 py-2 text-white">Lưu</button>
    </form>
  );
}
