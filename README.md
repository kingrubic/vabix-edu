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

---

## MyBizCar 3D — Động cơ doanh nghiệp MTUA

Ứng dụng đo lường và hình dung quản trị, domain mục tiêu: https://bizcar.vabix.edu.vn

### Chạy local

```bash
npm install
npm run dev
```

- Website doanh nghiệp: http://localhost:3000
- MyBizCar: http://localhost:3000/engine rồi `/login`

Tài khoản DEMO (mật khẩu chung `Demo@Vabix2026!`):

- `ceo@demo.vabix.edu.vn` — COMPANY_ADMIN
- `coach@vabix.edu.vn` — COACH_EVALUATOR
- `admin@vabix.edu.vn` — SUPER_ADMIN
- `academic@vabix.edu.vn` — ACADEMIC_ADMIN
- `member@demo.vabix.edu.vn` — COMPANY_MEMBER
- `viewer@demo.vabix.edu.vn` — VIEWER

Khi chưa có `DATABASE_URL`, ứng dụng dùng kho JSON cục bộ `data/bizcar-store.json` (tự seed lần đầu).

### Biến môi trường

Xem `.env.example`. Bắt buộc trên production: `AUTH_SECRET`.

### Gắn domain bizcar.vabix.edu.vn

1. Trỏ DNS về cùng deployment Next.js.
2. Đặt `BIZCAR_HOST=bizcar.vabix.edu.vn`.
3. Middleware rewrite `/` trên host này sang `/engine`.
4. Bật HTTPS và đặt `AUTH_SECRET` đủ dài.
5. Khi có Supabase/PostgreSQL: chạy `prisma/migrations/0001_init_rls.sql` rồi đặt `DATABASE_URL` (adapter Prisma sẽ được nối vào `src/db` — hiện MVP dùng file store + schema sẵn).

Chu kỳ Nạp–Nén–Nổ–Neo là cấu trúc ghi nhớ BMDO, không phải mô tả quan hệ nhân quả cơ học.
Phiên bản phát triển phục vụ hiệu chỉnh và kiểm chứng thực địa.
