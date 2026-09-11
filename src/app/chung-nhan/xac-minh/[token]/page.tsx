import { rateLimit } from "@/security/rateLimit";
import { publicVerify } from "@/platform/lms/certificates";
import { bootPlatform } from "@/platform/boot";
import { headers } from "next/headers";
import { formatDate } from "@/platform/time";

export default async function VerifyPage({ params }: { params: Promise<{ token: string }> }) {
  await bootPlatform();
  const { token } = await params;
  const ip = (await headers()).get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`cert:${ip}`, 30, 60 * 1000);
  if (!limited.ok) return <p className="p-8">Quá nhiều lượt xác minh. Thử lại sau.</p>;
  const data = publicVerify(token);
  if (!data) return <p className="p-8">Không tìm thấy chứng nhận.</p>;
  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Xác minh chứng nhận VABIX</h1>
      <dl className="platform-card mt-6 space-y-2 p-6 text-sm">
        <div><dt className="text-[#66746f]">Người nhận</dt><dd>{data.recipient}</dd></div>
        <div><dt className="text-[#66746f]">Chương trình</dt><dd>{data.program}</dd></div>
        <div><dt className="text-[#66746f]">Ngày cấp</dt><dd>{formatDate(data.issuedAt)}</dd></div>
        <div><dt className="text-[#66746f]">Trạng thái</dt><dd>{data.status}</dd></div>
        <div><dt className="text-[#66746f]">Mã</dt><dd>{data.code}</dd></div>
      </dl>
    </div>
  );
}
