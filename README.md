# VABIX — Làng kết nối tri thức & kinh doanh

Website doanh nghiệp mới của VABIX, xây trên **Next.js App Router**, TypeScript và hệ thống thiết kế teal + gold.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Lệnh kiểm tra

```bash
npm run lint
npm run typecheck
npm run build
```

## Cấu trúc nội dung

- Liên hệ, mạng xã hội, cổng cư dân: `src/lib/siteConfig.ts`
- Chuyên gia, bài viết, case study, sự kiện, giải pháp, mô hình: `src/content/`
- Form lead gọi `POST /api/leads`. Khi chưa có backend, set `LEAD_WEBHOOK_URL` hoặc form sẽ trả lỗi trung thực (không giả success).

## Ghi chú audit

Thư mục gốc ban đầu **không có codebase website** — chỉ có hồ sơ năng lực 2026, logo và slide. Site cũ tại https://vabix.vn/ chạy nền tảng ShopXanh (marketplace). Dự án này tái cấu trúc thông tin, giữ chức năng cư dân / làng ngành / nhà cung cấp / cẩm nang / sách / bộ sưu tập qua IA mới và redirect URL cũ.
