import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-vabix-deep-teal">Không tìm thấy trang</h1>
      <p className="measure mx-auto mt-4 text-vabix-muted">
        Đường dẫn có thể đã được chuyển sang kiến trúc thông tin mới. Hãy bắt đầu lại từ trang chủ hoặc kho tri thức.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/" variant="teal">
          Về trang chủ
        </Button>
        <Link href="/tri-thuc" className="inline-flex min-h-11 items-center px-4 font-semibold text-vabix-deep-teal">
          Kho tri thức
        </Link>
      </div>
    </section>
  );
}
