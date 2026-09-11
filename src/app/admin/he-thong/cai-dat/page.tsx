import { requireMenu } from "@/platform/auth/guard";
import { mailConfigured } from "@/platform/mail/send";
import { issuanceReady } from "@/platform/lms/certificates";

export default async function SettingsPage() {
  await requireMenu("/admin/he-thong/cai-dat");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Cài đặt</h1>
      <ul className="platform-card space-y-2 p-6 text-sm">
        <li>Email vận hành: {mailConfigured() ? "Đã cấu hình EMAIL_WEBHOOK_URL" : "Chưa kết nối — hệ thống không giả gửi email."}</li>
        <li>Chữ ký/con dấu chứng nhận: {issuanceReady() ? "Sẵn sàng phát hành" : "Chưa sẵn sàng phát hành."}</li>
        <li>Múi giờ hiển thị mặc định: Asia/Ho_Chi_Minh</li>
      </ul>
    </div>
  );
}
