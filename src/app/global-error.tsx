"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#F8F5ED] text-[#163C3E] antialiased">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-semibold tracking-[0.16em] uppercase">500</p>
          <h1 className="mt-4 text-3xl font-semibold">Có lỗi xảy ra</h1>
          <p className="mt-4 text-[#5b6b6c]">
            Trang chưa tải được. Hãy thử lại, hoặc quay về trang chủ VABIX.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="min-h-11 bg-[#163C3E] px-5 text-sm font-semibold text-white"
              onClick={() => reset()}
            >
              Thử lại
            </button>
            {/* global-error replaces the root layout, so next/link is unavailable. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="inline-flex min-h-11 items-center px-5 text-sm font-semibold">
              Về trang chủ
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
