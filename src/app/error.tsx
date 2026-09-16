"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-28 text-center">
      <p className="eyebrow">500</p>
      <h1 className="mt-4 text-4xl font-semibold text-vabix-deep-teal">Có lỗi xảy ra</h1>
      <p className="measure mx-auto mt-4 text-vabix-muted">
        Hệ thống chưa xử lý được yêu cầu này. Vui lòng thử lại hoặc liên hệ VABIX.
      </p>
      <div className="mt-8 flex gap-3">
        <Button type="button" variant="teal" onClick={reset}>
          Thử lại
        </Button>
        <Button href="/lien-he" variant="outline">
          Liên hệ
        </Button>
      </div>
    </section>
  );
}
